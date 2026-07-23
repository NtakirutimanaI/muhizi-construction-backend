import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, In, Repository } from 'typeorm';
import { Project } from '../projects/entities/project.entity';
import { ProjectEvidence } from '../project-evidence/entities/project-evidence.entity';
import { ClientReport } from '../client-reports/entities/client-report.entity';

// Explicit allowlist — a client must never receive budget/spent (internal financials)
// or partner/contact linkage fields, even accidentally via a future relation/column add.
const PROJECT_SELECT: FindOptionsSelect<Project> = {
    id: true, name: true, description: true, type: true, status: true, location: true,
    startDate: true, endDate: true, progress: true, images: true, createdAt: true, updatedAt: true,
    sites: {
        id: true, name: true, description: true, location: true, status: true,
        startDate: true, endDate: true, progress: true, images: true, projectId: true,
        createdAt: true, updatedAt: true,
    },
};

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
            select: PROJECT_SELECT,
            order: { createdAt: 'DESC' },
        });
    }

    /** Loads a project only if it belongs to this client — throws 404 otherwise (never leaks another client's project). */
    private async getOwnedProject(projectId: string, clientUserId: string): Promise<Project> {
        const project = await this.projectRepo.findOne({
            where: { id: projectId, clientUserId },
            relations: ['sites'],
            select: PROJECT_SELECT,
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
            select: {
                id: true, title: true, description: true, progressPercentage: true, status: true,
                projectId: true, createdById: true, createdAt: true, updatedAt: true,
                project: PROJECT_SELECT,
                // createdBy is a full User relation — never let password/refreshToken/otpCode
                // leave the server (see the app-wide note flagged separately).
                createdBy: { id: true, firstName: true, lastName: true },
            },
            order: { createdAt: 'DESC' },
        });
    }
}
