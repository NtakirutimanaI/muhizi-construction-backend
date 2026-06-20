import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryConfig } from './interfaces/cloudinary-config.interface';

@Injectable()
export class CloudinaryService {
    private readonly logger = new Logger(CloudinaryService.name);

    constructor(private configService: ConfigService) {
        const config = this.getConfig();
        if (!config.cloudName || !config.apiKey || !config.apiSecret) {
            this.logger.error('Cloudinary config is incomplete');
        }
        cloudinary.config({
            cloud_name: config.cloudName,
            api_key: config.apiKey,
            api_secret: config.apiSecret,
        });
    }

    private getConfig(): CloudinaryConfig {
        return {
            cloudName: this.configService.get<string>('CLOUDINARY_CLOUD_NAME') || '',
            apiKey: this.configService.get<string>('CLOUDINARY_API_KEY') || '',
            apiSecret: this.configService.get<string>('CLOUDINARY_API_SECRET') || '',
            uploadPreset: this.configService.get<string>('CLOUDINARY_UPLOAD_PRESET') || '',
        };
    }

    async uploadFile(
        file: Express.Multer.File,
        options?: {
            folder?: string;
            resourceType?: 'image' | 'video' | 'raw' | 'auto';
            publicId?: string;
        },
    ) {
        try {
            const resourceType = options?.resourceType || this.detectResourceType(file.mimetype);

            const result = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: options?.folder || 'muhizi_construction',
                        resource_type: resourceType,
                        public_id: options?.publicId,
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    },
                );

                uploadStream.end(file.buffer);
            });

            this.logger.log(`File uploaded to Cloudinary: ${result.public_id}`);

            return {
                publicId: result.public_id,
                url: result.url,
                secureUrl: result.secure_url,
                format: result.format,
                resourceType: result.resource_type,
                originalFilename: file.originalname,
                bytes: result.bytes,
                width: result.width,
                height: result.height,
            };
        } catch (error) {
            this.logger.error(`Failed to upload file to Cloudinary: ${error.message}`, error.stack);
            throw error;
        }
    }

    async deleteFile(publicId: string): Promise<void> {
        try {
            await cloudinary.uploader.destroy(publicId);
            this.logger.log(`File deleted from Cloudinary: ${publicId}`);
        } catch (error) {
            this.logger.error(`Failed to delete file from Cloudinary: ${error.message}`, error.stack);
            throw error;
        }
    }

    private detectResourceType(mimetype: string): 'image' | 'video' | 'raw' | 'auto' {
        if (mimetype.startsWith('image/')) return 'image';
        if (mimetype.startsWith('video/')) return 'video';
        return 'auto';
    }
}
