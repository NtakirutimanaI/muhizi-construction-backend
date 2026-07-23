import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { EngineeringSubmission } from './entities/engineering-submission.entity';
import { CreateEngineeringSubmissionDto } from './dto/create-engineering-submission.dto';
import { UpdateSubmissionStatusDto } from './dto/update-submission-status.dto';
import { Task, TaskStatus } from '../tasks/entities/task.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class EngineeringSubmissionsService {
    constructor(
        @InjectRepository(EngineeringSubmission)
        private repo: Repository<EngineeringSubmission>,
        @InjectRepository(Task)
        private taskRepo: Repository<Task>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    async create(dto: CreateEngineeringSubmissionDto, submittedBy: string): Promise<EngineeringSubmission> {
        const submission = this.repo.create({
            ...dto,
            submittedBy,
        });
        const saved = await this.repo.save(submission);

        if (dto.taskId) {
            const task = await this.taskRepo.findOne({ where: { id: dto.taskId } });
            if (task) {
                task.status = TaskStatus.COMPLETED;
                await this.taskRepo.save(task);
            }
        }

        return saved;
    }

    async findAll(): Promise<any[]> {
        const subs = await this.repo.find({ order: { createdAt: 'DESC' } });
        const userIds = [...new Set(subs.map(s => s.submittedBy).filter(Boolean))];
        if (userIds.length === 0) return subs;
        const users = await this.userRepo.find({ where: { id: In(userIds) }, select: ['id', 'firstName', 'lastName', 'email'] });
        const userMap = new Map(users.map(u => [u.id, u]));
        return subs.map(s => ({
            ...s,
            submitter: userMap.get(s.submittedBy) || null,
        }));
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

    async update(id: string, dto: CreateEngineeringSubmissionDto): Promise<EngineeringSubmission> {
        const submission = await this.findOne(id);
        if (dto.title !== undefined) submission.title = dto.title;
        if (dto.description !== undefined) submission.description = dto.description;
        if (dto.documentUrls !== undefined) submission.documentUrls = dto.documentUrls;
        return this.repo.save(submission);
    }

    async submitToAdmin(id: string, notes?: string): Promise<EngineeringSubmission> {
        const submission = await this.findOne(id);
        submission.submittedToAdmin = true;
        if (notes) submission.submissionNotes = notes;
        return this.repo.save(submission);
    }

    async undoSubmitToAdmin(id: string): Promise<EngineeringSubmission> {
        const submission = await this.findOne(id);
        submission.submittedToAdmin = false;
        submission.submissionNotes = null as any;
        return this.repo.save(submission);
    }
}
