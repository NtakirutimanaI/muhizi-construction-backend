import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PettyCash } from './entities/petty-cash.entity';
import { CreatePettyCashDto } from './dto/create-petty-cash.dto';

@Injectable()
export class PettyCashService {
    constructor(
        @InjectRepository(PettyCash)
        private repo: Repository<PettyCash>,
    ) {}

    async create(dto: CreatePettyCashDto, userId: string, userName: string): Promise<PettyCash> {
        const entity = this.repo.create({ ...dto, recordedById: userId, recordedByName: userName });
        return this.repo.save(entity);
    }

    async findAll(): Promise<PettyCash[]> {
        return this.repo.find({ order: { date: 'DESC', createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<PettyCash> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Petty cash record not found');
        return entity;
    }

    async update(id: string, dto: Partial<CreatePettyCashDto>): Promise<PettyCash> {
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Petty cash record not found');
    }

    async getBalance(): Promise<{ totalIn: number; totalOut: number; balance: number }> {
        const result = await this.repo
            .createQueryBuilder('pc')
            .select('pc.type', 'type')
            .addSelect('SUM(pc.amount)', 'total')
            .groupBy('pc.type')
            .getRawMany();

        let totalIn = 0;
        let totalOut = 0;
        for (const row of result) {
            if (row.type === 'in') totalIn = Number(row.total);
            if (row.type === 'out') totalOut = Number(row.total);
        }
        return { totalIn, totalOut, balance: totalIn - totalOut };
    }
}
