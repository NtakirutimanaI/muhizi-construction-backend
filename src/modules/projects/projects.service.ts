import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private repo: Repository<Project>,
    ) { }

    async create(dto: CreateProjectDto): Promise<Project> {
        const project = this.repo.create(dto);
        return this.repo.save(project);
    }

    async findAll(): Promise<Project[]> {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<Project> {
        try {
            const project = await this.repo.findOne({ where: { id } });
            if (!project) throw new NotFoundException('Project not found');
            return project;
        } catch (error: any) {
            if (error instanceof NotFoundException) throw error;
            throw new BadRequestException('Invalid project ID format');
        }
    }

    async update(id: string, dto: Partial<CreateProjectDto>): Promise<Project> {
        try {
            await this.repo.update(id, dto as any);
            return this.findOne(id);
        } catch (error: any) {
            if (error instanceof NotFoundException || error instanceof BadRequestException) throw error;
            throw new BadRequestException('Invalid project ID format');
        }
    }

    async remove(id: string): Promise<void> {
        try {
            const result = await this.repo.delete(id);
            if (result.affected === 0) throw new NotFoundException('Project not found');
        } catch (error: any) {
            if (error instanceof NotFoundException) throw error;
            throw new BadRequestException('Invalid project ID format');
        }
    }
}
