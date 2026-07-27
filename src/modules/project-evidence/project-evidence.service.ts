import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ProjectEvidence } from './entities/project-evidence.entity';
import { Site } from '../sites/entities/site.entity';
import { CreateProjectEvidenceDto } from './dto/create-project-evidence.dto';
import { UpdateProjectEvidenceDto } from './dto/update-project-evidence.dto';

@Injectable()
export class ProjectEvidenceService {
    constructor(
        @InjectRepository(ProjectEvidence)
        private repo: Repository<ProjectEvidence>,
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

    async create(dto: CreateProjectEvidenceDto, engineerId?: string): Promise<ProjectEvidence> {
        if (engineerId) await this.assertSiteAssigned(engineerId, dto.siteId);
        const entity = this.repo.create(dto);
        return this.repo.save(entity);
    }

    async findAll(clientVisible?: boolean, engineerId?: string): Promise<ProjectEvidence[]> {
        const where: any = clientVisible ? { approvedForClient: true } : {};
        if (engineerId) {
            const siteIds = await this.assignedSiteIds(engineerId);
            if (siteIds.length === 0) return [];
            where.siteId = In(siteIds);
        }
        return this.repo.find({ where, order: { date: 'DESC', createdAt: 'DESC' } });
    }

    async findOne(id: string, engineerId?: string): Promise<ProjectEvidence> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Project evidence not found');
        if (engineerId) {
            const siteIds = await this.assignedSiteIds(engineerId);
            if (!entity.siteId || !siteIds.includes(entity.siteId)) throw new NotFoundException('Project evidence not found');
        }
        return entity;
    }

    async update(id: string, dto: UpdateProjectEvidenceDto, engineerId?: string): Promise<ProjectEvidence> {
        if (engineerId) {
            const existing = await this.findOne(id, engineerId);
            await this.assertSiteAssigned(engineerId, dto.siteId || existing.siteId);
        }
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Project evidence not found');
    }
}
