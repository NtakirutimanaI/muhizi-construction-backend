import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { SiteActivity } from './entities/site-activity.entity';
import { Site } from '../sites/entities/site.entity';
import { CreateSiteActivityDto } from './dto/create-site-activity.dto';

@Injectable()
export class SiteActivitiesService {
    constructor(
        @InjectRepository(SiteActivity)
        private repo: Repository<SiteActivity>,
        @InjectRepository(Site)
        private siteRepo: Repository<Site>,
    ) { }

    private async assignedSiteIds(engineerId: string): Promise<string[]> {
        const sites = await this.siteRepo.find({ where: { assignedEngineerId: engineerId } });
        return sites.map(s => s.id);
    }

    private async assertSiteAssigned(engineerId: string, siteId?: string): Promise<void> {
        if (!siteId) throw new ForbiddenException('A site is required');
        const siteIds = await this.assignedSiteIds(engineerId);
        if (!siteIds.includes(siteId)) throw new ForbiddenException('You are not assigned to this site');
    }

    async create(dto: CreateSiteActivityDto, engineerId?: string): Promise<SiteActivity> {
        if (engineerId) await this.assertSiteAssigned(engineerId, dto.siteId);
        const activity = this.repo.create(dto);
        return this.repo.save(activity);
    }

    async findAll(engineerId?: string): Promise<SiteActivity[]> {
        if (engineerId) {
            const siteIds = await this.assignedSiteIds(engineerId);
            if (siteIds.length === 0) return [];
            return this.repo.find({ where: { isActive: true, siteId: In(siteIds) }, order: { date: 'DESC', createdAt: 'DESC' } });
        }
        return this.repo.find({ where: { isActive: true }, order: { date: 'DESC', createdAt: 'DESC' } });
    }

    async findAllAdmin(engineerId?: string): Promise<SiteActivity[]> {
        if (engineerId) {
            const siteIds = await this.assignedSiteIds(engineerId);
            if (siteIds.length === 0) return [];
            return this.repo.find({ where: { siteId: In(siteIds) }, order: { date: 'DESC', createdAt: 'DESC' } });
        }
        return this.repo.find({ order: { date: 'DESC', createdAt: 'DESC' } });
    }

    async findOne(id: string, engineerId?: string): Promise<SiteActivity> {
        const activity = await this.repo.findOne({ where: { id } });
        if (!activity) throw new NotFoundException('Site activity not found');
        if (engineerId) {
            const siteIds = await this.assignedSiteIds(engineerId);
            if (!activity.siteId || !siteIds.includes(activity.siteId)) throw new NotFoundException('Site activity not found');
        }
        return activity;
    }

    async update(id: string, dto: Partial<CreateSiteActivityDto>, engineerId?: string): Promise<SiteActivity> {
        if (engineerId) {
            const existing = await this.findOne(id, engineerId);
            await this.assertSiteAssigned(engineerId, dto.siteId || existing.siteId);
        }
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Site activity not found');
    }
}
