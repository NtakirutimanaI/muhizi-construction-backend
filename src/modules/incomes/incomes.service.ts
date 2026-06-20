import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Income } from './entities/income.entity';
import { CreateIncomeDto } from './dto/create-income.dto';

@Injectable()
export class IncomesService {
    constructor(
        @InjectRepository(Income)
        private repo: Repository<Income>,
    ) { }

    async create(dto: CreateIncomeDto): Promise<Income> {
        const income = this.repo.create(dto);
        return this.repo.save(income);
    }

    async findAll(): Promise<Income[]> {
        return this.repo.find({ order: { date: 'DESC' } });
    }

    async findOne(id: string): Promise<Income> {
        const income = await this.repo.findOne({ where: { id } });
        if (!income) throw new NotFoundException('Income record not found');
        return income;
    }

    async findByDateRange(start: string, end: string): Promise<Income[]> {
        return this.repo.find({
            where: { date: Between(start, end) },
            order: { date: 'DESC' },
        });
    }

    async update(id: string, dto: Partial<CreateIncomeDto>): Promise<Income> {
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Income record not found');
    }

    async getTotal(): Promise<number> {
        const result = await this.repo
            .createQueryBuilder('income')
            .select('SUM(income.amount)', 'total')
            .getRawOne();
        return Number(result?.total || 0);
    }
}
