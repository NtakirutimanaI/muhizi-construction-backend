import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SharedFile } from './entities/shared-file.entity';
import { CreateSharedFileDto } from './dto/create-shared-file.dto';

@Injectable()
export class SharedFilesService {
    constructor(
        @InjectRepository(SharedFile)
        private repo: Repository<SharedFile>,
    ) {}

    async create(dto: CreateSharedFileDto, sharedBy: string): Promise<SharedFile> {
        const record = this.repo.create({ ...dto, sharedBy });
        return this.repo.save(record);
    }

    async findAll(): Promise<SharedFile[]> {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }

    async findByUser(userId: string): Promise<SharedFile[]> {
        return this.repo.find({ where: { sharedTo: userId }, order: { createdAt: 'DESC' } });
    }

    async findByDesign(designId: string): Promise<SharedFile[]> {
        return this.repo.find({ where: { designId }, order: { createdAt: 'DESC' } });
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Shared file record not found');
    }
}
