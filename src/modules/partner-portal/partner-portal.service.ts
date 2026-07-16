import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { ProjectEvidence } from '../project-evidence/entities/project-evidence.entity';

@Injectable()
export class PartnerPortalService {
    constructor(
        @InjectRepository(Project)
        private projectRepo: Repository<Project>,
        @InjectRepository(ProjectEvidence)
        private evidenceRepo: Repository<ProjectEvidence>,
    ) {}

    async getProjects(partnerUserId: string) {
        return this.projectRepo.find({
            where: { partnerUserId },
            relations: ['sites'],
            order: { createdAt: 'DESC' },
        });
    }

    /** Loads a project only if it belongs to this partner — throws 404 otherwise. */
    private async getOwnedProject(projectId: string, partnerUserId: string): Promise<Project> {
        const project = await this.projectRepo.findOne({
            where: { id: projectId, partnerUserId },
        });
        if (!project) throw new NotFoundException('Project not found');
        return project;
    }

    async getProjectEvidence(projectId: string, partnerUserId: string) {
        await this.getOwnedProject(projectId, partnerUserId);
        return this.evidenceRepo.find({
            where: { site: { projectId }, approvedForClient: true } as any,
            order: { date: 'DESC', createdAt: 'DESC' },
        });
    }
}
