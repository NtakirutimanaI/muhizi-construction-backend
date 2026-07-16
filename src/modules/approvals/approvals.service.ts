import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Approval } from './entities/approval.entity';
import { CreateApprovalDto } from './dto/create-approval.dto';

@Injectable()
export class ApprovalsService {
    constructor(
        @InjectRepository(Approval)
        private repo: Repository<Approval>,
    ) { }

    async create(dto: CreateApprovalDto, requesterId: string, requesterName: string): Promise<Approval> {
        const entity = this.repo.create({ ...dto, requester: requesterName, requesterId });
        return this.repo.save(entity);
    }

    async findAll(): Promise<Approval[]> {
        return this.repo.find({ order: { requestedAt: 'DESC', createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<Approval> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Approval not found');
        return entity;
    }

    async update(id: string, dto: Partial<CreateApprovalDto>, reviewerId?: string, reviewerName?: string): Promise<Approval> {
        const patch: Partial<Approval> = { ...dto };
        if (dto.status && dto.status !== 'pending' && reviewerId) {
            patch.reviewedById = reviewerId;
            patch.reviewedByName = reviewerName;
        }
        await this.repo.update(id, patch as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Approval not found');
    }
}
