import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MaterialRequest } from './entities/material-request.entity';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';
import { UpdateMaterialRequestStatusDto } from './dto/update-material-request-status.dto';
import { NotificationService } from '../notification/services/notification.service';
import { NotificationType } from '../notification/entities/notification.entity';
import { User } from '../auth/entities/user.entity';
import { ExpensesService } from '../expenses/expenses.service';
import { ExpenseCategory } from '../expenses/entities/expense.entity';
import { Stock } from '../stock/entities/stock.entity';


@Injectable()
export class MaterialRequestsService {
    constructor(
        @InjectRepository(MaterialRequest)
        private repo: Repository<MaterialRequest>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Stock)
        private stockRepo: Repository<Stock>,
        private notificationService: NotificationService,
        private expensesService: ExpensesService,
    ) { }

    async create(dto: CreateMaterialRequestDto, userId?: string, userName?: string): Promise<MaterialRequest> {
        const unitPrice = dto.unitPrice || 0;
        const totalCost = dto.quantity * unitPrice;
        const entity = this.repo.create({ ...dto, unitPrice, totalCost, createdById: userId, createdByName: userName });
        const saved = await this.repo.save(entity);

        const financeDirectors = await this.userRepo.find({ where: { role: 'finance_director' } });
        for (const fd of financeDirectors) {
            await this.notificationService.create({
                type: NotificationType.SYSTEM,
                title: 'New Material Request',
                message: `${userName || 'A user'} requested ${dto.quantity} ${dto.unit} of ${dto.material} for project ${dto.project}`,
                user: { id: fd.id },
                metadata: { materialRequestId: saved.id, project: dto.project },
            });
        }

        return saved;
    }

    async findAll(): Promise<MaterialRequest[]> {
        return this.repo.find({ order: { date: 'DESC', createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<MaterialRequest> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Material request not found');
        return entity;
    }

    async update(id: string, dto: Partial<CreateMaterialRequestDto>): Promise<MaterialRequest> {
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async approve(id: string, userId: string, userName: string): Promise<MaterialRequest> {
        const entity = await this.findOne(id);
        if (entity.status !== 'pending') throw new Error('Can only approve pending requests');
        entity.status = 'approved';
        entity.approvedById = userId;
        entity.approvedByName = userName;
        entity.approvedAt = new Date();
        const saved = await this.repo.save(entity);

        if (saved.totalCost > 0) {
            await this.expensesService.create({
                description: `Material: ${saved.material} for ${saved.project}`,
                amount: Number(saved.totalCost),
                category: ExpenseCategory.MATERIALS,
                date: saved.date,
                vendor: saved.createdByName || undefined,
                notes: `Auto-created from approved material request (${saved.quantity} ${saved.unit} @ RWF ${Number(saved.unitPrice).toLocaleString()}/unit)`,
            });

            await this.stockRepo.save(this.stockRepo.create({
                item: saved.material,
                category: 'construction_materials',
                type: 'in',
                quantity: Number(saved.quantity),
                unit: saved.unit,
                unitPrice: Number(saved.unitPrice),
                totalCost: Number(saved.totalCost),
                date: saved.date,
                reference: `MR-${saved.id}`,
                notes: `Auto-stock from approved request: ${saved.quantity} ${saved.unit} for ${saved.project}`,
                createdById: userId,
                createdByName: userName,
            }));
        }

        return saved;
    }

    async reject(id: string, userId: string, userName: string, notes?: string): Promise<MaterialRequest> {
        const entity = await this.findOne(id);
        if (entity.status !== 'pending') throw new Error('Can only reject pending requests');
        entity.status = 'rejected';
        entity.approvedById = userId;
        entity.approvedByName = userName;
        entity.approvedAt = new Date();
        if (notes) entity.notes = notes;
        return this.repo.save(entity);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Material request not found');
    }
}
