import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';

@Injectable()
export class ExpensesService {
    constructor(
        @InjectRepository(Expense)
        private repo: Repository<Expense>,
    ) { }

    async create(dto: CreateExpenseDto): Promise<Expense> {
        const expense = this.repo.create(dto);
        return this.repo.save(expense);
    }

    async findAll(): Promise<Expense[]> {
        return this.repo.find({ order: { date: 'DESC' } });
    }

    async findOne(id: string): Promise<Expense> {
        const expense = await this.repo.findOne({ where: { id } });
        if (!expense) throw new NotFoundException('Expense record not found');
        return expense;
    }

    async findByDateRange(start: string, end: string): Promise<Expense[]> {
        return this.repo.find({
            where: { date: Between(start, end) },
            order: { date: 'DESC' },
        });
    }

    async update(id: string, dto: Partial<CreateExpenseDto>): Promise<Expense> {
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Expense record not found');
    }

    async getTotal(): Promise<number> {
        const result = await this.repo
            .createQueryBuilder('expense')
            .select('SUM(expense.amount)', 'total')
            .getRawOne();
        return Number(result?.total || 0);
    }
}
