import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PettyCashTransaction, TransactionType } from './entities/petty-cash-transaction.entity';
import { PettyCashFund } from '../petty-cash-fund/entities/petty-cash-fund.entity';
import { CreatePettyCashTransactionDto } from './dto/create-petty-cash-transaction.dto';

@Injectable()
export class PettyCashTransactionService {
    constructor(
        @InjectRepository(PettyCashTransaction)
        private repo: Repository<PettyCashTransaction>,
        @InjectRepository(PettyCashFund)
        private fundRepo: Repository<PettyCashFund>,
    ) {}

    private isPositiveType(type: TransactionType): boolean {
        return [
            TransactionType.CASH_RETURNED,
            TransactionType.FUND_REPLENISHMENT,
            TransactionType.ADJUSTMENT,
            TransactionType.CORRECTION,
            TransactionType.VOUCHER_RECEIPT,
        ].includes(type);
    }

    async create(dto: CreatePettyCashTransactionDto, userId?: string, userName?: string): Promise<PettyCashTransaction> {
        const fund = await this.fundRepo.findOne({ where: { id: dto.fundId } });
        if (!fund) throw new NotFoundException('Petty cash fund not found');

        const balanceBefore = Number(fund.currentBalance);
        const change = this.isPositiveType(dto.transactionType) ? Number(dto.amount) : -Number(dto.amount);
        const balanceAfter = balanceBefore + change;

        const entity = this.repo.create({
            ...dto,
            fundCode: fund.fundCode,
            balanceBefore,
            balanceAfter,
            performedById: userId,
            performedByName: userName,
        });

        fund.currentBalance = balanceAfter;
        await this.fundRepo.save(fund);

        return this.repo.save(entity);
    }

    async findAll(fundId?: string): Promise<PettyCashTransaction[]> {
        const where = fundId ? { fundId } : {};
        return this.repo.find({ where, order: { createdAt: 'DESC' } });
    }

    async findByFund(fundId: string): Promise<PettyCashTransaction[]> {
        return this.repo.find({ where: { fundId }, order: { createdAt: 'DESC' } });
    }

    async getStats(): Promise<{
        total: number;
        totalAmount: number;
        byType: Record<string, number>;
    }> {
        const all = await this.repo.find();
        const byType: Record<string, number> = {};
        for (const t of all) {
            byType[t.transactionType] = (byType[t.transactionType] || 0) + 1;
        }
        return {
            total: all.length,
            totalAmount: all.reduce((s, t) => s + Number(t.amount), 0),
            byType,
        };
    }
}
