import { Injectable, NotFoundException } from '@nestjs/common';
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
        const design = this.repo.create(dto);
        return this.repo.save(design);
    }

    async findAll(): Promise<Design[]> {
        return this.repo.find({ order: { createdAt: 'DESC' }, relations: ['project'] });
    }

    async findOne(id: string): Promise<Design> {
        const design = await this.repo.findOne({ where: { id }, relations: ['project'] });
        if (!design) throw new NotFoundException('Design not found');
        return design;
    }

    async update(id: string, dto: Partial<CreateDesignDto>): Promise<Design> {
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Design not found');
    }
}
