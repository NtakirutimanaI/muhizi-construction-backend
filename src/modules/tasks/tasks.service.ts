import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskStatus } from './entities/task.entity';
import { User } from '../auth/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task) private taskRepo: Repository<Task>,
        @InjectRepository(User) private userRepo: Repository<User>,
    ) {}

    async create(dto: CreateTaskDto, userId: string, userName: string) {
        const task = this.taskRepo.create({
            ...dto,
            assignedBy: userId,
            assignedByName: userName,
        });
        return this.taskRepo.save(task);
    }

    async findAll() {
        return this.taskRepo.find({ order: { createdAt: 'DESC' } });
    }

    async findMyTasks(userId: string) {
        return this.taskRepo.find({
            where: { assignedTo: userId },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string) {
        const task = await this.taskRepo.findOne({ where: { id } });
        if (!task) throw new NotFoundException('Task not found');
        return task;
    }

    async updateStatus(id: string, dto: UpdateTaskDto) {
        const task = await this.findOne(id);
        if (dto.status) task.status = dto.status;
        if (dto.completionNotes) task.completionNotes = dto.completionNotes;
        return this.taskRepo.save(task);
    }

    async update(id: string, dto: EditTaskDto) {
        const task = await this.findOne(id);
        if (dto.title !== undefined) task.title = dto.title;
        if (dto.description !== undefined) task.description = dto.description;
        if (dto.priority !== undefined) task.priority = dto.priority;
        if (dto.assignedTo !== undefined) task.assignedTo = dto.assignedTo;
        if (dto.assignedToName !== undefined) task.assignedToName = dto.assignedToName;
        if (dto.dueDate !== undefined) task.dueDate = dto.dueDate;
        if (dto.notes !== undefined) task.notes = dto.notes;
        return this.taskRepo.save(task);
    }

    async remove(id: string) {
        const task = await this.findOne(id);
        await this.taskRepo.remove(task);
        return { message: 'Task deleted successfully' };
    }

    async clearAll() {
        await this.taskRepo.clear();
        return { message: 'All tasks cleared successfully' };
    }

    async findEngineeringStudioMembers() {
        const users = await this.userRepo.find({
            where: { role: 'engineering_studio', employmentStatus: 'employed' },
            relations: ['profile'],
            order: { firstName: 'ASC' },
        });
        return users.map(u => {
            const { password, refreshToken, otpCode, otpExpiresAt, googleId, ...userData } = u;
            return userData;
        });
    }
}
