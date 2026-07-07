import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteRule } from './entities/site-rule.entity';
import { CreateSiteRuleDto } from './dto/create-site-rule.dto';

@Injectable()
export class SiteRulesService {
    constructor(
        @InjectRepository(SiteRule)
        private repo: Repository<SiteRule>,
    ) { }

    async create(dto: CreateSiteRuleDto): Promise<SiteRule> {
        const rule = this.repo.create(dto);
        return this.repo.save(rule);
    }

    async findAll(): Promise<SiteRule[]> {
        return this.repo.find({ where: { isActive: true }, order: { order: 'ASC', createdAt: 'DESC' } });
    }

    async findAllAdmin(): Promise<SiteRule[]> {
        return this.repo.find({ order: { order: 'ASC', createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<SiteRule> {
        const rule = await this.repo.findOne({ where: { id } });
        if (!rule) throw new NotFoundException('Site rule not found');
        return rule;
    }

    async update(id: string, dto: Partial<CreateSiteRuleDto>): Promise<SiteRule> {
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Site rule not found');
    }
}
