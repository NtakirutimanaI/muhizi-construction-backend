import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialRequest } from './entities/material-request.entity';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';
import { UpdateMaterialRequestStatusDto } from './dto/update-material-request-status.dto';

@Injectable()
export class MaterialRequestsService {
    constructor(
        @InjectRepository(MaterialRequest)
        private repo: Repository<MaterialRequest>,
    ) { }

    async create(dto: CreateMaterialRequestDto, userId?: string, userName?: string): Promise<MaterialRequest> {
        const entity = this.repo.create({ ...dto, createdById: userId, createdByName: userName });
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

    async approve(id: string, userId: string, userName: string): Promise<MaterialRequest> {
        const entity = await this.findOne(id);
        if (entity.status !== 'pending') throw new Error('Can only approve pending requests');
        entity.status = 'approved';
        entity.approvedById = userId;
        entity.approvedByName = userName;
        entity.approvedAt = new Date();
        return this.repo.save(entity);
    }

    async reject(id: string, userId: string, userName: string, notes?: string): Promise<MaterialRequest> {
        const entity = await this.findOne(id);
        if (entity.status !== 'pending') throw new Error('Can only reject pending requests');
        entity.status = 'rejected';
        entity.approvedById = userId;
        entity.approvedByName = userName;
        entity.approvedAt = new Date();
        if (notes) entity.notes = notes;
        return this.repo.save(entity);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Material request not found');
    }
}
