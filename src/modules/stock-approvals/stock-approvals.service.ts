import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockApproval } from './entities/stock-approval.entity';
import { CreateStockApprovalDto, UpdateStockApprovalDto } from './dto/create-stock-approval.dto';

@Injectable()
export class StockApprovalsService {
    constructor(
        @InjectRepository(StockApproval)
        private repo: Repository<StockApproval>,
    ) {}

    async findAll(status?: string) {
        const where = status ? { status } : {};
        return this.repo.find({
            where,
            relations: ['stock', 'approvedBy'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string) {
        const approval = await this.repo.findOne({ where: { id }, relations: ['stock', 'approvedBy'] });
        if (!approval) throw new NotFoundException('Stock approval not found');
        return approval;
    }

    async create(dto: CreateStockApprovalDto, userId: string) {
        return this.repo.save(this.repo.create({ ...dto, approvedById: userId }));
    }

    async update(id: string, dto: UpdateStockApprovalDto) {
        const approval = await this.findOne(id);
        Object.assign(approval, dto);
        return this.repo.save(approval);
    }

    async remove(id: string) {
        const approval = await this.findOne(id);
        return this.repo.remove(approval);
    }
}
