import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsuranceSetting } from './entities/insurance-setting.entity';
import { CreateInsuranceSettingDto } from './dto/create-insurance-setting.dto';

@Injectable()
export class InsuranceService {
    constructor(
        @InjectRepository(InsuranceSetting)
        private repo: Repository<InsuranceSetting>,
    ) {}

    async findAll(): Promise<InsuranceSetting[]> {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }

    async findActive(): Promise<InsuranceSetting[]> {
        return this.repo.find({ where: { isActive: true }, order: { createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<InsuranceSetting> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Insurance setting not found');
        return entity;
    }

    async create(dto: CreateInsuranceSettingDto): Promise<InsuranceSetting> {
        const entity = this.repo.create(dto);
        return this.repo.save(entity);
    }

    async update(id: string, dto: Partial<CreateInsuranceSettingDto>): Promise<InsuranceSetting> {
        const entity = await this.findOne(id);
        Object.assign(entity, dto);
        return this.repo.save(entity);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Insurance setting not found');
    }

    async getTotalDeduction(): Promise<number> {
        const active = await this.findActive();
        return active.reduce((sum, s) => sum + Number(s.employeeAmount), 0);
    }
}
