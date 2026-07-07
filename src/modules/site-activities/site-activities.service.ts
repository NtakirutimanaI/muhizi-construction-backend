import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SiteActivity } from './entities/site-activity.entity';
import { CreateSiteActivityDto } from './dto/create-site-activity.dto';

@Injectable()
export class SiteActivitiesService {
    constructor(
        @InjectRepository(SiteActivity)
        private repo: Repository<SiteActivity>,
    ) { }

    async create(dto: CreateSiteActivityDto): Promise<SiteActivity> {
        const activity = this.repo.create(dto);
        return this.repo.save(activity);
    }

    async findAll(): Promise<SiteActivity[]> {
        return this.repo.find({ where: { isActive: true }, order: { date: 'DESC', createdAt: 'DESC' } });
    }

    async findAllAdmin(): Promise<SiteActivity[]> {
        return this.repo.find({ order: { date: 'DESC', createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<SiteActivity> {
        const activity = await this.repo.findOne({ where: { id } });
        if (!activity) throw new NotFoundException('Site activity not found');
        return activity;
    }

    async update(id: string, dto: Partial<CreateSiteActivityDto>): Promise<SiteActivity> {
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Site activity not found');
    }
}
