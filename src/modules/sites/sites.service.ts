import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Site } from './entities/site.entity';
import { Project } from '../projects/entities/project.entity';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@Injectable()
export class SitesService {
    constructor(
        @InjectRepository(Site)
        private repo: Repository<Site>,
        @InjectRepository(Project)
        private projectRepo: Repository<Project>,
    ) { }

    async create(dto: CreateSiteDto): Promise<Site> {
        const existing = await this.repo.findOne({ where: { name: dto.name } });
        if (existing) throw new ConflictException('A site with this name already exists');
        const site = this.repo.create(dto);
        return this.repo.save(site);
    }

    async findAll(engineerId?: string): Promise<Site[]> {
        return this.repo.find({
            where: engineerId ? { assignedEngineerId: engineerId } : {},
            relations: ['project'],
            order: { createdAt: 'DESC' },
        });
    }

    async findByProject(projectId: string, engineerId?: string): Promise<Site[]> {
        return this.repo.find({
            where: engineerId ? { projectId, assignedEngineerId: engineerId } : { projectId },
            relations: ['rules', 'activities', 'evidence'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string, engineerId?: string): Promise<Site> {
        const site = await this.repo.findOne({
            where: { id },
            relations: ['project', 'rules', 'activities', 'evidence'],
        });
        if (!site) throw new NotFoundException('Site not found');
        if (engineerId && site.assignedEngineerId !== engineerId) throw new NotFoundException('Site not found');
        return site;
    }

    async update(id: string, dto: UpdateSiteDto): Promise<Site> {
        if (dto.name) {
            const existing = await this.repo.findOne({ where: { name: dto.name } });
            if (existing && existing.id !== id) throw new ConflictException('A site with this name already exists');
        }
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Site not found');
    }
}
