import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
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

    async getProjects(clientUserId: string) {
        return this.projectRepo.find({
            where: { clientUserId },
            relations: ['sites'],
            order: { createdAt: 'DESC' },
        });
    }

    /** Loads a project only if it belongs to this client — throws 404 otherwise (never leaks another client's project). */
    private async getOwnedProject(projectId: string, clientUserId: string): Promise<Project> {
        const project = await this.projectRepo.findOne({
            where: { id: projectId, clientUserId },
            relations: ['sites'],
        });
        if (!project) throw new NotFoundException('Project not found');
        return project;
    }

    async getProjectProgress(projectId: string, clientUserId: string) {
        const project = await this.getOwnedProject(projectId, clientUserId);
        const evidenceCount = await this.evidenceRepo.count({
            where: { site: { projectId }, approvedForClient: true } as any,
        });
        const reports = await this.reportRepo.find({
            where: { projectId, status: 'published' },
            order: { createdAt: 'DESC' },
        });
        return { project, evidenceCount, reports };
    }

    async getProjectEvidence(projectId: string, clientUserId: string) {
        await this.getOwnedProject(projectId, clientUserId);
        return this.evidenceRepo.find({
            where: { site: { projectId }, approvedForClient: true } as any,
            order: { date: 'DESC', createdAt: 'DESC' },
        });
    }

    async getReports(clientUserId: string) {
        const projects = await this.projectRepo.find({ where: { clientUserId }, select: ['id'] });
        if (projects.length === 0) return [];
        return this.reportRepo.find({
            where: { projectId: In(projects.map((p) => p.id)), status: 'published' },
            relations: ['project', 'createdBy'],
            order: { createdAt: 'DESC' },
        });
    }
}
