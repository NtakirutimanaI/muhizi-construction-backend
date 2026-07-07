import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from '../projects/entities/project.entity';
import { ProjectEvidence } from '../project-evidence/entities/project-evidence.entity';
import { ClientReport } from '../client-reports/entities/client-report.entity';

@Injectable()
export class ClientPortalService {
    constructor(
        @InjectRepository(Project)
        private projectRepo: Repository<Project>,
        @InjectRepository(ProjectEvidence)
        private evidenceRepo: Repository<ProjectEvidence>,
        @InjectRepository(ClientReport)
        private reportRepo: Repository<ClientReport>,
    ) {}

    async getProjects() {
        return this.projectRepo.find({
            relations: ['sites'],
            order: { createdAt: 'DESC' },
        });
    }

    async getProjectProgress(projectId: string) {
        const project = await this.projectRepo.findOne({
            where: { id: projectId },
            relations: ['sites'],
        });
        if (!project) throw new NotFoundException('Project not found');
        const evidenceCount = await this.evidenceRepo.count();
        const reports = await this.reportRepo.find({
            where: { projectId, status: 'published' },
            order: { createdAt: 'DESC' },
        });
        return { project, evidenceCount, reports };
    }

    async getProjectEvidence(projectId: string) {
        return this.evidenceRepo.find({
            order: { createdAt: 'DESC' },
        });
    }

    async getReports() {
        return this.reportRepo.find({
            where: { status: 'published' },
            relations: ['project', 'createdBy'],
            order: { createdAt: 'DESC' },
        });
    }
}
