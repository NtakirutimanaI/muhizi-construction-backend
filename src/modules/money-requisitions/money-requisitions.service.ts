import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoneyRequisition } from './entities/money-requisition.entity';
import { CreateMoneyRequisitionDto } from './dto/create-money-requisition.dto';
import { ReviewMoneyRequisitionDto } from './dto/review-money-requisition.dto';
import { NotificationService } from '../notification/services/notification.service';
import { NotificationType } from '../notification/entities/notification.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class MoneyRequisitionsService {
    constructor(
        @InjectRepository(MoneyRequisition)
        private repo: Repository<MoneyRequisition>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private notificationService: NotificationService,
    ) {}

    async create(dto: CreateMoneyRequisitionDto, userId: string, userName: string): Promise<MoneyRequisition> {
        const entity = this.repo.create({
            ...dto,
            requesterId: userId,
            requesterName: userName,
            status: 'pending',
        });
        const saved = await this.repo.save(entity);

        const admins = await this.userRepo.find({ where: { role: 'admin' } });
        for (const admin of admins) {
            await this.notificationService.create({
                type: NotificationType.SYSTEM,
                title: 'New Money Requisition',
                message: `${userName} requested RWF ${Number(dto.amount).toLocaleString()} — ${dto.title}`,
                user: { id: admin.id },
                metadata: { moneyRequisitionId: saved.id },
            });
        }

        return saved;
    }

    async findAll(): Promise<MoneyRequisition[]> {
        return this.repo.find({ order: { createdAt: 'DESC' } });
    }

    async findAllByRequester(requesterId: string): Promise<MoneyRequisition[]> {
        return this.repo.find({ where: { requesterId }, order: { createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<MoneyRequisition> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Money requisition not found');
        return entity;
    }

    async review(id: string, dto: ReviewMoneyRequisitionDto, reviewerId: string, reviewerName: string): Promise<MoneyRequisition> {
        const entity = await this.findOne(id);
        if (entity.status !== 'pending') {
            throw new BadRequestException('Can only review pending requisitions');
        }

        entity.status = dto.status;
        entity.reviewedById = reviewerId;
        entity.reviewedByName = reviewerName;
        entity.reviewedAt = new Date().toISOString().split('T')[0];

        if (dto.notes) entity.adminNotes = dto.notes;

        if (dto.modifiedAmount !== undefined && dto.modifiedAmount !== Number(entity.amount)) {
            entity.adminNotes = [
                entity.adminNotes,
                dto.modificationReason ? `Modified: ${dto.modificationReason}` : null,
                `Amount changed from RWF ${Number(entity.amount).toLocaleString()} to RWF ${dto.modifiedAmount.toLocaleString()}`,
            ].filter(Boolean).join(' | ');
            entity.amount = dto.modifiedAmount;
        }

        const saved = await this.repo.save(entity);

        if (entity.requesterId) {
            await this.notificationService.create({
                type: NotificationType.SYSTEM,
                title: `Money Requisition ${dto.status === 'approved' ? 'Approved' : 'Rejected'}`,
                message: `${reviewerName} ${dto.status} your requisition "${entity.title}" for RWF ${Number(entity.amount).toLocaleString()}`,
                user: { id: entity.requesterId },
                metadata: { moneyRequisitionId: saved.id },
            });
        }

        return saved;
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Money requisition not found');
    }
}
