import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class StockService {
    constructor(
        @InjectRepository(Stock)
        private repo: Repository<Stock>,
    ) { }

    async create(dto: CreateStockDto, userId?: string, userName?: string): Promise<Stock> {
        const unitPrice = dto.unitPrice || 0;
        const totalCost = dto.quantity * unitPrice;
        const entity = this.repo.create({
            ...dto,
            unitPrice,
            totalCost,
            createdById: userId,
            createdByName: userName,
        });
        return this.repo.save(entity);
    }

    async findAll(): Promise<Stock[]> {
        return this.repo.find({ order: { date: 'DESC', createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<Stock> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Stock entry not found');
        return entity;
    }

    async update(id: string, dto: UpdateStockDto): Promise<Stock> {
        const entity = await this.findOne(id);
        const merged = { ...entity, ...dto };
        if (dto.unitPrice !== undefined || dto.quantity !== undefined) {
            merged.unitPrice = dto.unitPrice ?? entity.unitPrice;
            merged.quantity = dto.quantity ?? entity.quantity;
            merged.totalCost = Number(merged.quantity) * Number(merged.unitPrice);
        }
        await this.repo.update(id, merged as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Stock entry not found');
    }

    async getStats(): Promise<{ totalIn: number; totalOut: number; netStock: number; itemCount: number }> {
        const all = await this.repo.find();
        const totalIn = all.filter(s => s.type === 'in').reduce((sum, s) => sum + Number(s.totalCost), 0);
        const totalOut = all.filter(s => s.type === 'out').reduce((sum, s) => sum + Number(s.totalCost), 0);
        const uniqueItems = new Set(all.map(s => s.item.toLowerCase()));
        return { totalIn, totalOut, netStock: totalIn - totalOut, itemCount: uniqueItems.size };
    }
}
