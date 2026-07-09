import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Income } from '../incomes/entities/income.entity';
import { Expense } from '../expenses/entities/expense.entity';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Income)
        private incomeRepo: Repository<Income>,
        @InjectRepository(Expense)
        private expenseRepo: Repository<Expense>,
    ) { }

    async getMonthlyReport(year: number, month: number): Promise<any> {
        if (month < 1 || month > 12) throw new BadRequestException('Month must be between 1 and 12');
        if (year < 1900 || year > 2100) throw new BadRequestException('Invalid year');
        const start = `${year}-${String(month).padStart(2, '0')}-01`;
        const endDate = new Date(year, month, 0);
        const end = endDate.toISOString().split('T')[0];

        const incomes = await this.incomeRepo
            .createQueryBuilder('i')
            .where('i.date BETWEEN :start AND :end', { start, end })
            .getMany();
        const expenses = await this.expenseRepo
            .createQueryBuilder('e')
            .where('e.date BETWEEN :start AND :end', { start, end })
            .getMany();

        const totalIncome = incomes.reduce((s, i) => s + Number(i.amount), 0);
        const totalExpense = expenses.reduce((s, e) => s + Number(e.amount), 0);

        return {
            year,
            month,
            totalIncome,
            totalExpense,
            netProfit: totalIncome - totalExpense,
            incomeCount: incomes.length,
            expenseCount: expenses.length,
            incomeByCategory: this.groupBy(incomes, 'category'),
            expenseByCategory: this.groupBy(expenses, 'category'),
        };
    }

    async getYearlyReport(year: number): Promise<any> {
        const start = `${year}-01-01`;
        const end = `${year}-12-31`;

        const incomes = await this.incomeRepo
            .createQueryBuilder('i')
            .where('i.date BETWEEN :start AND :end', { start, end })
            .getMany();
        const expenses = await this.expenseRepo
            .createQueryBuilder('e')
            .where('e.date BETWEEN :start AND :end', { start, end })
            .getMany();

        const totalIncome = incomes.reduce((s, i) => s + Number(i.amount), 0);
        const totalExpense = expenses.reduce((s, e) => s + Number(e.amount), 0);

        const monthlyData: { month: number; income: number; expense: number }[] = [];
        for (let m = 1; m <= 12; m++) {
            const ms = `${year}-${String(m).padStart(2, '0')}-01`;
            const me = new Date(year, m, 0).toISOString().split('T')[0];
            const mi = incomes.filter(i => i.date >= ms && i.date <= me);
            const me2 = expenses.filter(e => e.date >= ms && e.date <= me);
            monthlyData.push({
                month: m,
                income: mi.reduce((s, i) => s + Number(i.amount), 0),
                expense: me2.reduce((s, e) => s + Number(e.amount), 0),
            });
        }

        return {
            year,
            totalIncome,
            totalExpense,
            netProfit: totalIncome - totalExpense,
            monthlyData,
        };
    }

    private groupBy(items: any[], key: string): Record<string, number> {
        return items.reduce((acc, item) => {
            const k = item[key];
            acc[k] = (acc[k] || 0) + Number(item.amount);
            return acc;
        }, {});
    }
}
