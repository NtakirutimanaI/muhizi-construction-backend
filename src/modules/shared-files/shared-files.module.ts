import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedFile } from './entities/shared-file.entity';
import { SharedFilesService } from './shared-files.service';
import { SharedFilesController } from './shared-files.controller';

@Module({
    imports: [TypeOrmModule.forFeature([SharedFile])],
    controllers: [SharedFilesController],
    providers: [SharedFilesService],
    exports: [SharedFilesService],
})
export class SharedFilesModule {}
