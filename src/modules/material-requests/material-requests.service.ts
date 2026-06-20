import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialRequest } from './entities/material-request.entity';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';

@Injectable()
export class MaterialRequestsService {
    constructor(
        @InjectRepository(MaterialRequest)
        private repo: Repository<MaterialRequest>,
    ) { }

    async create(dto: CreateMaterialRequestDto): Promise<MaterialRequest> {
        const entity = this.repo.create(dto);
        return this.repo.save(entity);
    }

    async findAll(): Promise<MaterialRequest[]> {
        return this.repo.find({ order: { date: 'DESC', createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<MaterialRequest> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Material request not found');
        return entity;
    }

    async update(id: string, dto: Partial<CreateMaterialRequestDto>): Promise<MaterialRequest> {
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Material request not found');
    }
}
