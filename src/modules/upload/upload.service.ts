import { Injectable, Logger, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUpload } from './entities/file-upload.entity';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class UploadService {
    private readonly logger = new Logger(UploadService.name);

    constructor(
        @InjectRepository(FileUpload)
        private fileUploadRepository: Repository<FileUpload>,
        private cloudinaryService: CloudinaryService,
    ) { }

    async uploadFile(
        file: Express.Multer.File,
        folder?: string,
    ) {
        const uploadResult = await this.uploadToCloudinary(
            () => this.cloudinaryService.uploadFile(file, {
                folder: folder || 'muhizi_construction',
                resourceType: this.detectResourceType(file.mimetype),
            }),
        );
        return this.saveFileRecord(uploadResult);
    }

    async uploadFromBase64(
        data: { filename: string; mimeType: string; data: string },
        folder?: string,
    ) {
        const uploadResult = await this.uploadToCloudinary(
            () => this.cloudinaryService.uploadFromBase64(data, {
                folder: folder || 'muhizi_construction',
            }),
        );
        return this.saveFileRecord(uploadResult);
    }

    private async uploadToCloudinary(uploadFn: () => Promise<any>) {
        try {
            return await uploadFn();
        } catch (error: any) {
            this.logger.error(`Cloudinary upload failed: ${error.message}`);
            throw new InternalServerErrorException(`Cloudinary upload failed: ${error.message}`);
        }
    }

    private async saveFileRecord(uploadResult: any) {
        try {
            const fileRecord = this.fileUploadRepository.create({
                publicId: uploadResult.publicId,
                url: uploadResult.url,
                secureUrl: uploadResult.secureUrl,
                format: uploadResult.format,
                resourceType: uploadResult.resourceType,
                originalFilename: uploadResult.originalFilename,
                bytes: uploadResult.bytes,
                width: uploadResult.width,
                height: uploadResult.height,
            });

            const savedRecord = await this.fileUploadRepository.save(fileRecord);
            this.logger.log(`File record saved to database: ${savedRecord.id}`);

            return savedRecord;
        } catch (error: any) {
            this.logger.error(`Database save failed after Cloudinary upload: ${error.message}`);
            // Cleanup: remove the uploaded file from Cloudinary
            try {
                await this.cloudinaryService.deleteFile(uploadResult.publicId);
            } catch { }
            throw new InternalServerErrorException(`Failed to save file record: ${error.message}`);
        }
    }

    async uploadFiles(files: Express.Multer.File[], folder?: string) {
        const uploadPromises = files.map((file) => this.uploadFile(file, folder));
        return Promise.all(uploadPromises);
    }

    async deleteFile(id: string): Promise<void> {
        const fileRecord = await this.fileUploadRepository.findOne({ where: { id } });
        if (!fileRecord) {
            throw new NotFoundException('File record not found');
        }

        await this.cloudinaryService.deleteFile(fileRecord.publicId);
        await this.fileUploadRepository.remove(fileRecord);
        this.logger.log(`File record deleted from database: ${id}`);
    }

    async getAllFiles() {
        return this.fileUploadRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    private detectResourceType(mimetype: string): 'image' | 'video' | 'raw' | 'auto' {
        if (mimetype.startsWith('image/')) return 'image';
        if (mimetype.startsWith('video/')) return 'video';
        return 'auto';
    }
}
