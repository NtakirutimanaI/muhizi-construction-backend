import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { CloudinaryService } from './cloudinary.service';
import { FileUpload } from './entities/file-upload.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([FileUpload]),
        MulterModule.register({
            storage: memoryStorage(),
            limits: {
                fileSize: 50 * 1024 * 1024,
            },
        }),
    ],
    controllers: [UploadController],
    providers: [UploadService, CloudinaryService],
    exports: [UploadService, CloudinaryService],
})
export class UploadModule { }
