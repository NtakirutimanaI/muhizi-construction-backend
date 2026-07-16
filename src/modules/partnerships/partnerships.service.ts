import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partnership, PartnershipStatus } from './entities/partnership.entity';
import { CreatePartnershipDto } from './dto/create-partnership.dto';

@Injectable()
export class PartnershipsService {
    constructor(
        @InjectRepository(Partnership)
        private repo: Repository<Partnership>,
    ) { }

    async create(dto: CreatePartnershipDto): Promise<Partnership> {
        const partnership = this.repo.create({ ...dto, status: dto.status || PartnershipStatus.PENDING });
        return this.repo.save(partnership);
    }

    async findAll(): Promise<Partnership[]> {
        return this.repo.find({ order: { createdAt: 'DESC' }, relations: ['project'] });
    }

    async findOne(id: string): Promise<Partnership> {
        const partnership = await this.repo.findOne({ where: { id }, relations: ['project'] });
        if (!partnership) throw new NotFoundException('Partnership not found');
        return partnership;
    }

    async update(id: string, dto: Partial<CreatePartnershipDto>, reviewerId?: string, reviewerName?: string): Promise<Partnership> {
        const current = await this.findOne(id);
        const patch: Partial<Partnership> = { ...dto } as any;
        if (dto.status && dto.status !== current.status && dto.status !== PartnershipStatus.PENDING && reviewerId) {
            patch.reviewedById = reviewerId;
            patch.reviewedByName = reviewerName;
            patch.reviewedAt = new Date();
        }
        await this.repo.update(id, patch as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Partnership not found');
    }
}
