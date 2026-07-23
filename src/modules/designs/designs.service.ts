import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Design } from './entities/design.entity';
import { CreateDesignDto } from './dto/create-design.dto';

@Injectable()
export class DesignsService {
    constructor(
        @InjectRepository(Design)
        private repo: Repository<Design>,
    ) { }

    async create(dto: CreateDesignDto): Promise<Design> {
        if (dto.source === 'submission' && dto.savedBy) {
            const existing = await this.repo.findOne({
                where: { title: dto.title, source: dto.source as any, savedBy: dto.savedBy },
            });
            if (existing) {
                throw new ConflictException('This submission is already saved in Designs');
            }
        }
        const cleaned = { ...dto };
        if (!cleaned.savedBy) delete cleaned.savedBy;
        if (!cleaned.projectId) delete cleaned.projectId;
        const design = this.repo.create(cleaned);
        return this.repo.save(design);
    }

    async findAll(userId?: string): Promise<Design[]> {
        const where: any = {};
        if (userId) where.savedBy = userId;
        return this.repo.find({ where, order: { createdAt: 'DESC' }, relations: ['project'] });
    }

    async findOne(id: string): Promise<Design> {
        const design = await this.repo.findOne({ where: { id }, relations: ['project'] });
        if (!design) throw new NotFoundException('Design not found');
        return design;
    }

    async update(id: string, dto: Partial<CreateDesignDto>): Promise<Design> {
        const cleaned = { ...dto };
        if (cleaned.savedBy === '') delete cleaned.savedBy;
        if (cleaned.projectId === '') delete cleaned.projectId;
        await this.repo.update(id, cleaned as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Design not found');
    }
}
