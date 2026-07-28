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

        try {
            const financeDirectors = await this.userRepo.find({ where: { role: 'finance_director' } });
            for (const fd of financeDirectors) {
                await this.notificationService.create({
                    type: NotificationType.SYSTEM,
                    title: 'New Material Request',
                    message: `${userName || 'A user'} requested ${dto.quantity} ${dto.unit} of ${dto.material} for ${dto.site ? dto.site + ' - ' : ''}project ${dto.project}`,
                    user: { id: fd.id },
                    metadata: { materialRequestId: saved.id, project: dto.project, site: dto.site },
                });
            }

            const storekeepers = await this.userRepo.find({ where: { role: 'storekeeper' } });
            for (const sk of storekeepers) {
                await this.notificationService.create({
                    type: NotificationType.SYSTEM,
                    title: 'New Material Request to Review',
                    message: `${userName || 'A user'} requested ${dto.quantity} ${dto.unit} of ${dto.material} for ${dto.site ? dto.site + ' - ' : ''}project ${dto.project}. Please review and approve/reject.`,
                    user: { id: sk.id },
                    metadata: { materialRequestId: saved.id, project: dto.project, site: dto.site },
                });
            }
        } catch (notifErr) {
            console.error('Failed to send material request notifications:', notifErr);
        }

        return saved;
    }

    async findAll(userId?: string): Promise<MaterialRequest[]> {
        return this.repo.find({ where: userId ? { createdById: userId } : {}, order: { date: 'DESC', createdAt: 'DESC' } });
    }

    async findOne(id: string, userId?: string): Promise<MaterialRequest> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Material request not found');
        if (userId && entity.createdById !== userId) throw new NotFoundException('Material request not found');
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
        }

        const existingStock = await this.stockRepo.findOne({ where: { item: saved.material } });
        const stockUnit = existingStock?.unit || saved.unit;
        const stockUnitPrice = existingStock?.unitPrice || Number(saved.unitPrice) || 0;
        const stockTotalCost = Number(saved.quantity) * stockUnitPrice;

        await this.stockRepo.save(this.stockRepo.create({
            item: saved.material,
            category: existingStock?.category || 'construction_materials',
            type: 'out',
            quantity: Number(saved.quantity),
            unit: stockUnit,
            unitPrice: stockUnitPrice,
            totalCost: stockTotalCost,
            date: saved.date,
            reference: `MR-${saved.id}`,
            notes: `Stock out from approved request: ${saved.quantity} ${stockUnit} for ${saved.project} (requested by ${saved.createdByName || 'Unknown'})`,
            createdById: userId,
            createdByName: userName,
        }));

        const admins = await this.userRepo.find({ where: { role: 'admin' } });
        for (const admin of admins) {
            await this.notificationService.create({
                type: NotificationType.SYSTEM,
                title: 'Material Request Approved',
                message: `${userName} approved ${saved.quantity} ${saved.unit} of ${saved.material} for project ${saved.project}. Stock deducted.`,
                user: { id: admin.id },
                metadata: { materialRequestId: saved.id, project: saved.project, material: saved.material, quantity: saved.quantity },
            });
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
