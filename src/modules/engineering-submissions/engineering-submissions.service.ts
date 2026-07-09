import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EngineeringSubmission } from './entities/engineering-submission.entity';
import { CreateEngineeringSubmissionDto } from './dto/create-engineering-submission.dto';
import { UpdateSubmissionStatusDto } from './dto/update-submission-status.dto';

@Injectable()
export class EngineeringSubmissionsService {
    constructor(
        @InjectRepository(EngineeringSubmission)
        private repo: Repository<EngineeringSubmission>,
    ) { }

    async create(dto: CreateEngineeringSubmissionDto, submittedBy: string): Promise<EngineeringSubmission> {
        const submission = this.repo.create({
            ...dto,
            submittedBy,
        });
        return this.repo.save(submission);
    }

    async findAll(): Promise<EngineeringSubmission[]> {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }

    async findMySubmissions(userId: string): Promise<EngineeringSubmission[]> {
        return this.repo.find({
            where: { submittedBy: userId },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<EngineeringSubmission> {
        const submission = await this.repo.findOne({ where: { id } });
        if (!submission) throw new NotFoundException('Engineering submission not found');
        return submission;
    }

    async updateStatus(id: string, dto: UpdateSubmissionStatusDto, reviewedBy: string): Promise<EngineeringSubmission> {
        const submission = await this.findOne(id);
        submission.status = dto.status;
        submission.reviewedBy = reviewedBy;
        if (dto.reviewNotes) {
            submission.reviewNotes = dto.reviewNotes;
        }
        return this.repo.save(submission);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Engineering submission not found');
    }
}
