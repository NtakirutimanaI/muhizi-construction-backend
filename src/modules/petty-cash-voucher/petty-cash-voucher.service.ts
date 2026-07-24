import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PettyCashVoucher, VoucherStatus } from './entities/petty-cash-voucher.entity';
import { CreatePettyCashVoucherDto } from './dto/create-petty-cash-voucher.dto';

@Injectable()
export class PettyCashVoucherService {
    constructor(
        @InjectRepository(PettyCashVoucher)
        private repo: Repository<PettyCashVoucher>,
    ) {}

    private async generateVoucherNumber(): Promise<string> {
        const year = new Date().getFullYear();
        const prefix = `PCV-${year}-`;
        const last = await this.repo
            .createQueryBuilder('v')
            .where('v."voucherNumber" LIKE :prefix', { prefix: `${prefix}%` })
            .orderBy('v."voucherNumber"', 'DESC')
            .getOne();
        let seq = 1;
        if (last) {
            const parts = last.voucherNumber.split('-');
            seq = parseInt(parts[2], 10) + 1;
        }
        return `${prefix}${String(seq).padStart(4, '0')}`;
    }

    async create(dto: CreatePettyCashVoucherDto, userId: string, userName: string): Promise<PettyCashVoucher> {
        const voucherNumber = await this.generateVoucherNumber();
        const entity = this.repo.create({
            ...dto,
            voucherNumber,
            createdById: userId,
            createdByName: userName,
            lastModifiedById: userId,
            lastModifiedByName: userName,
        });
        return this.repo.save(entity);
    }

    async findAll(): Promise<PettyCashVoucher[]> {
        return this.repo.find({ order: { date: 'DESC', createdAt: 'DESC' } });
    }

    async findOne(id: string): Promise<PettyCashVoucher> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Petty cash voucher not found');
        return entity;
    }

    async update(id: string, dto: Partial<CreatePettyCashVoucherDto>, userId?: string, userName?: string): Promise<PettyCashVoucher> {
        const entity = await this.findOne(id);
        Object.assign(entity, dto);
        if (userId) entity.lastModifiedById = userId;
        if (userName) entity.lastModifiedByName = userName;
        return this.repo.save(entity);
    }

    async submit(id: string): Promise<PettyCashVoucher> {
        const entity = await this.findOne(id);
        if (entity.status !== VoucherStatus.DRAFT && entity.status !== VoucherStatus.REJECTED) {
            throw new BadRequestException('Only draft or rejected vouchers can be submitted');
        }
        entity.status = VoucherStatus.PENDING;
        return this.repo.save(entity);
    }

    async approve(id: string, approvedByName: string): Promise<PettyCashVoucher> {
        const entity = await this.findOne(id);
        if (entity.status !== VoucherStatus.PENDING) {
            throw new BadRequestException('Only pending vouchers can be approved');
        }
        entity.status = VoucherStatus.APPROVED;
        entity.approvedByName = approvedByName;
        entity.approvedDate = new Date().toISOString().split('T')[0];
        return this.repo.save(entity);
    }

    async reject(id: string, rejectedByName: string, reason?: string): Promise<PettyCashVoucher> {
        const entity = await this.findOne(id);
        if (entity.status !== VoucherStatus.PENDING) {
            throw new BadRequestException('Only pending vouchers can be rejected');
        }
        entity.status = VoucherStatus.REJECTED;
        entity.approvedByName = rejectedByName;
        entity.approvedDate = new Date().toISOString().split('T')[0];
        entity.rejectionReason = reason ?? '';
        return this.repo.save(entity);
    }

    async markPaid(id: string, confirmedByName: string, notes?: string): Promise<PettyCashVoucher> {
        const entity = await this.findOne(id);
        if (entity.status !== VoucherStatus.APPROVED) {
            throw new BadRequestException('Only approved vouchers can be marked as paid');
        }
        entity.status = VoucherStatus.PAID;
        entity.confirmedByName = confirmedByName;
        entity.confirmedDate = new Date().toISOString().split('T')[0];
        entity.paymentConfirmationNotes = notes ?? '';
        return this.repo.save(entity);
    }

    async close(id: string): Promise<PettyCashVoucher> {
        const entity = await this.findOne(id);
        if (entity.status !== VoucherStatus.PAID) {
            throw new BadRequestException('Only paid vouchers can be closed');
        }
        entity.status = VoucherStatus.CLOSED;
        return this.repo.save(entity);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Petty cash voucher not found');
    }

    async getStats(): Promise<{ total: number; totalAmount: number; draft: number; pending: number; approved: number; paid: number; closed: number; rejected: number }> {
        const all = await this.repo.find();
        return {
            total: all.length,
            totalAmount: all.reduce((s, v) => s + Number(v.amount), 0),
            draft: all.filter(v => v.status === VoucherStatus.DRAFT).length,
            pending: all.filter(v => v.status === VoucherStatus.PENDING).length,
            approved: all.filter(v => v.status === VoucherStatus.APPROVED).length,
            paid: all.filter(v => v.status === VoucherStatus.PAID).length,
            closed: all.filter(v => v.status === VoucherStatus.CLOSED).length,
            rejected: all.filter(v => v.status === VoucherStatus.REJECTED).length,
        };
    }
}
