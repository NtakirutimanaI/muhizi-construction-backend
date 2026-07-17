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

    async create(dto: CreateIncomeDto, recordedById?: string, recordedByName?: string): Promise<Income> {
        const income = this.repo.create({ ...dto, recordedById, recordedByName });
        return this.repo.save(income);
    }

    async findAll(): Promise<Income[]> {
        return this.repo.find({ order: { date: 'DESC' }, relations: ['project'] });
    }

    async findOne(id: string): Promise<Income> {
        const income = await this.repo.findOne({ where: { id }, relations: ['project'] });
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

    async getTotal(): Promise<number> {
        const result = await this.repo
            .createQueryBuilder('income')
            .select('SUM(income.amount)', 'total')
            .getRawOne();
        return Number(result?.total || 0);
    }
}
