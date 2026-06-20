import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Employee not found');
    }
}
