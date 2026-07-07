import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payroll } from './entities/payroll.entity';
import { CreatePayrollDto } from './dto/create-payroll.dto';

@Injectable()
export class PayrollService {
    constructor(
        @InjectRepository(Payroll)
        private repo: Repository<Payroll>,
    ) { }

    async create(dto: CreatePayrollDto): Promise<Payroll> {
        const totalAllowances = dto.allowances?.reduce((s, a) => s + a.amount, 0) || 0;
        const totalDeductions = dto.deductions?.reduce((s, d) => s + d.amount, 0) || 0;
        const payroll = this.repo.create({
            ...dto,
            totalAllowances,
            totalDeductions,
            netSalary: dto.netSalary || (dto.basicSalary + totalAllowances - totalDeductions),
        });
        return this.repo.save(payroll);
    }

    async findAll(): Promise<Payroll[]> {
        return this.repo.find({
            order: { year: 'DESC', month: 'DESC' },
            relations: ['employee'],
        });
    }

    async findOne(id: string): Promise<Payroll> {
        const payroll = await this.repo.findOne({ where: { id }, relations: ['employee'] });
        if (!payroll) throw new NotFoundException('Payroll record not found');
        return payroll;
    }

    async findByPeriod(month: number, year: number): Promise<Payroll[]> {
        return this.repo.find({
            where: { month, year },
            relations: ['employee'],
        });
    }

    async findByEmployee(employeeId: string): Promise<Payroll[]> {
        return this.repo.find({
            where: { employeeId },
            order: { year: 'DESC', month: 'DESC' },
        });
    }

    async update(id: string, dto: Partial<CreatePayrollDto>): Promise<Payroll> {
        const updateData: any = { ...dto };
        if (dto.allowances) {
            updateData.totalAllowances = dto.allowances.reduce((s, a) => s + a.amount, 0);
        }
        if (dto.deductions) {
            updateData.totalDeductions = dto.deductions.reduce((s, d) => s + d.amount, 0);
        }
        await this.repo.update(id, updateData);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Payroll record not found');
    }
}
