import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DailyReport } from './entities/daily-report.entity';
import { CreateDailyReportDto } from './dto/create-daily-report.dto';

@Injectable()
export class DailyReportsService {
    constructor(
        @InjectRepository(DailyReport)
        private repo: Repository<DailyReport>,
    ) { }

    async create(dto: CreateDailyReportDto, submittedById: string, submittedByName: string): Promise<DailyReport> {
        const report = this.repo.create({
            date: dto.date || new Date().toISOString().split('T')[0],
            summary: dto.summary,
            submittedById,
            submittedByName,
        });
        return this.repo.save(report);
    }

    async findAll(): Promise<DailyReport[]> {
        return this.repo.find({ order: { date: 'DESC', createdAt: 'DESC' } });
    }

    async findMy(submittedById: string): Promise<DailyReport[]> {
        return this.repo.find({ where: { submittedById }, order: { date: 'DESC', createdAt: 'DESC' } });
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Daily report not found');
    }
}
