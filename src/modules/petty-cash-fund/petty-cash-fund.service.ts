import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PettyCashFund, FundStatus } from './entities/petty-cash-fund.entity';
import { CreatePettyCashFundDto } from './dto/create-petty-cash-fund.dto';

@Injectable()
export class PettyCashFundService {
    constructor(
        @InjectRepository(PettyCashFund)
        private repo: Repository<PettyCashFund>,
    ) {}

    private async generateFundCode(): Promise<string> {
        const year = new Date().getFullYear();
        const prefix = `PCF-${year}-`;
        const last = await this.repo
            .createQueryBuilder('f')
            .where('f."fundCode" LIKE :prefix', { prefix: `${prefix}%` })
            .orderBy('f."fundCode"', 'DESC')
            .getOne();
        let seq = 1;
        if (last) {
            const parts = last.fundCode.split('-');
            seq = parseInt(parts[2], 10) + 1;
        }
        return `${prefix}${String(seq).padStart(4, '0')}`;
    }

    async create(dto: CreatePettyCashFundDto, userId: string, userName: string): Promise<PettyCashFund> {
        const fundCode = await this.generateFundCode();
        const entity = this.repo.create({
            ...dto,
            fundCode,
            currentBalance: dto.openingBalance,
            createdById: userId,
            createdByName: userName,
            lastModifiedById: userId,
            lastModifiedByName: userName,
        });
        return this.repo.save(entity);
    }

    async findAll(): Promise<PettyCashFund[]> {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<PettyCashFund> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Petty cash fund not found');
        return entity;
    }

    async update(id: string, dto: Partial<CreatePettyCashFundDto>, userId?: string, userName?: string): Promise<PettyCashFund> {
        const entity = await this.findOne(id);
        Object.assign(entity, dto);
        if (userId) entity.lastModifiedById = userId;
        if (userName) entity.lastModifiedByName = userName;
        return this.repo.save(entity);
    }

    async replenish(id: string, amount: number, description?: string): Promise<PettyCashFund> {
        if (amount <= 0) {
            throw new BadRequestException('Replenishment amount must be greater than zero');
        }
        const entity = await this.findOne(id);
        entity.currentBalance = Number(entity.currentBalance) + amount;
        return this.repo.save(entity);
    }

    async adjust(id: string, amount: number, description?: string): Promise<PettyCashFund> {
        if (amount === 0) {
            throw new BadRequestException('Adjustment amount cannot be zero');
        }
        const entity = await this.findOne(id);
        const newBalance = Number(entity.currentBalance) + amount;
        if (newBalance < 0) {
            throw new BadRequestException('Adjustment would result in a negative balance');
        }
        entity.currentBalance = newBalance;
        return this.repo.save(entity);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Petty cash fund not found');
    }

    async getStats(): Promise<{ total: number; totalBalance: number; active: number; inactive: number }> {
        const all = await this.repo.find();
        return {
            total: all.length,
            totalBalance: all.reduce((s, f) => s + Number(f.currentBalance), 0),
            active: all.filter(f => f.status === FundStatus.ACTIVE).length,
            inactive: all.filter(f => f.status === FundStatus.INACTIVE).length,
        };
    }
}
