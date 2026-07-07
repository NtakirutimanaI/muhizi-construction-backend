import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalaryRate } from './entities/salary-rate.entity';
import { CreateSalaryRateDto, UpdateSalaryRateDto } from './dto/create-salary-rate.dto';

@Injectable()
export class SalaryRatesService {
    constructor(
        @InjectRepository(SalaryRate)
        private repo: Repository<SalaryRate>,
    ) {}

    async findAll() {
        return this.repo.find({ relations: ['employee'], order: { createdAt: 'DESC' } });
    }

    async findOne(id: string) {
        const rate = await this.repo.findOne({ where: { id }, relations: ['employee'] });
        if (!rate) throw new NotFoundException('Salary rate not found');
        return rate;
    }

    async findByEmployee(employeeId: string) {
        return this.repo.find({
            where: { employeeId },
            order: { effectiveFrom: 'DESC' },
        });
    }

    async create(dto: CreateSalaryRateDto) {
        return this.repo.save(this.repo.create(dto));
    }

    async update(id: string, dto: UpdateSalaryRateDto) {
        const rate = await this.findOne(id);
        Object.assign(rate, dto);
        return this.repo.save(rate);
    }

    async remove(id: string) {
        const rate = await this.findOne(id);
        return this.repo.remove(rate);
    }
}
