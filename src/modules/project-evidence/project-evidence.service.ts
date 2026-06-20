import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEvidence } from './entities/project-evidence.entity';
import { CreateProjectEvidenceDto } from './dto/create-project-evidence.dto';

@Injectable()
export class ProjectEvidenceService {
    constructor(
        @InjectRepository(ProjectEvidence)
        private repo: Repository<ProjectEvidence>,
    ) { }

    async create(dto: CreateProjectEvidenceDto): Promise<ProjectEvidence> {
        const entity = this.repo.create(dto);
        return this.repo.save(entity);
    }

    async findAll(clientVisible?: boolean): Promise<ProjectEvidence[]> {
        const where = clientVisible ? { approvedForClient: true } : {};
        return this.repo.find({ where: where as any, order: { date: 'DESC', createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<ProjectEvidence> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Project evidence not found');
        return entity;
    }

    async update(id: string, dto: Partial<CreateProjectEvidenceDto>): Promise<ProjectEvidence> {
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Project evidence not found');
    }
}
