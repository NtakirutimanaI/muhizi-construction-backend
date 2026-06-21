import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EmployeeAssignment } from './entities/employee-assignment.entity';
import { CreateEmployeeAssignmentDto } from './dto/create-employee-assignment.dto';
import { UpdateEmployeeAssignmentDto } from './dto/update-employee-assignment.dto';

@Injectable()
export class EmployeeAssignmentsService {
    constructor(
        @InjectRepository(EmployeeAssignment)
        private repo: Repository<EmployeeAssignment>,
    ) { }

    async create(dto: CreateEmployeeAssignmentDto): Promise<EmployeeAssignment> {
        const assignment = this.repo.create(dto);
        return this.repo.save(assignment);
    }

    async findAll(): Promise<EmployeeAssignment[]> {
        return this.repo.find({
            relations: ['employee', 'project'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<EmployeeAssignment> {
        const assignment = await this.repo.findOne({ where: { id }, relations: ['employee', 'project'] });
        if (!assignment) throw new NotFoundException('Employee assignment not found');
        return assignment;
    }

    async findByEmployee(employeeId: string): Promise<EmployeeAssignment[]> {
        return this.repo.find({
            where: { employeeId, isActive: true },
            relations: ['project'],
            order: { startDate: 'DESC' },
        });
    }

    async findByProject(projectId: string): Promise<EmployeeAssignment[]> {
        return this.repo.find({
            where: { projectId, isActive: true },
            relations: ['employee'],
            order: { startDate: 'DESC' },
        });
    }

    async update(id: string, dto: UpdateEmployeeAssignmentDto): Promise<EmployeeAssignment> {
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Employee assignment not found');
    }
}
