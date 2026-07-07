import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ClientReport } from './entities/client-report.entity';
import { CreateClientReportDto, UpdateClientReportDto } from './dto/create-client-report.dto';

@Injectable()
export class ClientReportsService {
    constructor(
        @InjectRepository(ClientReport)
        private repo: Repository<ClientReport>,
    ) {}

    async findAll(status?: string) {
        const where = status ? { status } : {};
        return this.repo.find({
            where,
            relations: ['project', 'createdBy'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string) {
        const report = await this.repo.findOne({ where: { id }, relations: ['project', 'createdBy'] });
        if (!report) throw new NotFoundException('Client report not found');
        return report;
    }

    async create(dto: CreateClientReportDto, userId: string) {
        return this.repo.save(this.repo.create({ ...dto, createdById: userId }));
    }

    async update(id: string, dto: UpdateClientReportDto) {
        const report = await this.findOne(id);
        Object.assign(report, dto);
        return this.repo.save(report);
    }

    async remove(id: string) {
        const report = await this.findOne(id);
        return this.repo.remove(report);
    }
}
