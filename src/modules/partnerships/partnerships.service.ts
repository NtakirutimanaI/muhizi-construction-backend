import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partnership } from './entities/partnership.entity';
import { CreatePartnershipDto } from './dto/create-partnership.dto';

@Injectable()
export class PartnershipsService {
    constructor(
        @InjectRepository(Partnership)
        private repo: Repository<Partnership>,
    ) { }

    async create(dto: CreatePartnershipDto): Promise<Partnership> {
        const partnership = this.repo.create(dto);
        return this.repo.save(partnership);
    }

    async findAll(): Promise<Partnership[]> {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<Partnership> {
        const partnership = await this.repo.findOne({ where: { id } });
        if (!partnership) throw new NotFoundException('Partnership not found');
        return partnership;
    }

    async update(id: string, dto: Partial<CreatePartnershipDto>): Promise<Partnership> {
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Partnership not found');
    }
}
