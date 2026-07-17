import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class EmployeesService {
    constructor(
        @InjectRepository(Employee)
        private repo: Repository<Employee>,
    ) { }

    async create(dto: CreateEmployeeDto): Promise<Employee> {
        const existing = await this.repo.findOne({ where: { email: dto.email } });
        if (existing) throw new ConflictException('Email already exists');
        const employee = this.repo.create(dto);
        return this.repo.save(employee);
    }

    async findAll(): Promise<Employee[]> {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<Employee> {
        const employee = await this.repo.findOne({ where: { id } });
        if (!employee) throw new NotFoundException('Employee not found');
        return employee;
    }

    async update(id: string, dto: Partial<CreateEmployeeDto>): Promise<Employee> {
        const current = await this.findOne(id);

        // Email and National ID are the identity anchors attendance, payroll and assignment
        // history are matched against — changing them after registration would silently
        // sever that history from the employee it belongs to.
        if (dto.email !== undefined && dto.email !== current.email) {
            throw new BadRequestException('Email cannot be changed after registration — it is used to match this employee\'s attendance, payroll, and assignment history.');
        }
        if (dto.nationalId !== undefined && current.nationalId && dto.nationalId !== current.nationalId) {
            throw new BadRequestException('National ID cannot be changed after registration.');
        }

        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Employee not found');
    }
}
