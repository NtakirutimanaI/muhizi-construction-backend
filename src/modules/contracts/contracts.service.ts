import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { CreateContractDto } from './dto/create-contract.dto';

@Injectable()
export class ContractsService {
    constructor(
        @InjectRepository(Contract)
        private repo: Repository<Contract>,
    ) { }

    async create(dto: CreateContractDto): Promise<Contract> {
        const entity = this.repo.create(dto);
        return this.repo.save(entity);
    }

    async findAll(): Promise<Contract[]> {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }

    async findByEmployee(employeeId: string): Promise<Contract[]> {
        return this.repo.find({ where: { employeeId }, order: { createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<Contract> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Contract not found');
        return entity;
    }

    async update(id: string, dto: Partial<CreateContractDto>): Promise<Contract> {
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Contract not found');
    }
}
