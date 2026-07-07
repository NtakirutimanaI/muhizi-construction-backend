import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
    constructor(
        @InjectRepository(AuditLog)
        private auditLogRepository: Repository<AuditLog>,
    ) { }

    async log(data: {
        userId: string;
        userEmail?: string;
        userRole?: string;
        action: string;
        entity?: string;
        entityId?: string;
        metadata?: Record<string, any>;
        ipAddress?: string;
    }) {
        try {
            const log = this.auditLogRepository.create(data);
            await this.auditLogRepository.save(log);
            return log;
        } catch (error) {
            console.warn('Audit log failed (non-critical):', error.message);
        }
    }

    async findAll(page = 1, limit = 50) {
        const [logs, total] = await this.auditLogRepository.findAndCount({
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { logs, total, page, limit };
    }

    async findByUser(userId: string, page = 1, limit = 20) {
        const [logs, total] = await this.auditLogRepository.findAndCount({
            where: { userId },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { logs, total, page, limit };
    }

    async findByAction(action: string, page = 1, limit = 20) {
        const [logs, total] = await this.auditLogRepository.findAndCount({
            where: { action },
            order: { createdAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { logs, total, page, limit };
    }

    async getStats() {
        const total = await this.auditLogRepository.count();
        const actions = await this.auditLogRepository
            .createQueryBuilder('a')
            .select('a.action', 'action')
            .addSelect('COUNT(a.id)', 'count')
            .groupBy('a.action')
            .orderBy('COUNT(a.id)', 'DESC')
            .limit(20)
            .getRawMany();
        return { total, actions };
    }
}
