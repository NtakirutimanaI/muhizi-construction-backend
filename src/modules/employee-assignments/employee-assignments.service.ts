import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { EmployeeAssignment } from './entities/employee-assignment.entity';
import { Employee } from '../employees/entities/employee.entity';
import { Site } from '../sites/entities/site.entity';
import { CreateEmployeeAssignmentDto } from './dto/create-employee-assignment.dto';
import { UpdateEmployeeAssignmentDto } from './dto/update-employee-assignment.dto';

@Injectable()
export class EmployeeAssignmentsService {
    constructor(
        @InjectRepository(EmployeeAssignment)
        private repo: Repository<EmployeeAssignment>,
        @InjectRepository(Employee)
        private employeeRepo: Repository<Employee>,
        @InjectRepository(Site)
        private siteRepo: Repository<Site>,
    ) { }

    async create(dto: CreateEmployeeAssignmentDto): Promise<EmployeeAssignment> {
        const assignment = this.repo.create(dto);
        return this.repo.save(assignment);
    }

    async findAll(): Promise<EmployeeAssignment[]> {
        return this.repo.find({
            relations: ['employee', 'project', 'site'],
            order: { createdAt: 'DESC' },
        });
    }

    async findMyTeam(userEmail: string): Promise<EmployeeAssignment[]> {
        const employee = await this.employeeRepo.findOne({ where: { email: userEmail } });
        if (!employee) throw new NotFoundException('Employee not found for this user');

        const myAssignments = await this.repo.find({
            where: { employeeId: employee.id, isActive: true },
            select: ['projectId', 'siteId'],
        });

        const projectIds = [...new Set(myAssignments
            .filter(a => a.projectId)
            .map(a => a.projectId))] as string[];

        const siteIds = [...new Set(myAssignments
            .filter(a => a.siteId)
            .map(a => a.siteId))] as string[];

        if (projectIds.length === 0 && siteIds.length === 0) return [];

        const where: any[] = [];
        if (projectIds.length > 0) where.push({ projectId: In(projectIds) });
        if (siteIds.length > 0) where.push({ siteId: In(siteIds) });

        return this.repo.find({
            where: where.length > 0 ? where : undefined,
            relations: ['employee', 'project', 'site'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<EmployeeAssignment> {
        const assignment = await this.repo.findOne({ where: { id }, relations: ['employee', 'project', 'site'] });
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

    async findByProject(projectId: string, engineerId?: string): Promise<EmployeeAssignment[]> {
        if (engineerId) {
            const assignedSite = await this.siteRepo.findOne({ where: { projectId, assignedEngineerId: engineerId } });
            if (!assignedSite) throw new ForbiddenException('You are not assigned to this project');
        }
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
