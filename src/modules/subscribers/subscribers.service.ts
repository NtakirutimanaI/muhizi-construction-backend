import { Injectable, ConflictException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Subscriber } from './entities/subscriber.entity';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { SendUpdateDto } from './dto/send-update.dto';

@Injectable()
export class SubscribersService {
    private readonly logger = new Logger(SubscribersService.name);

    constructor(
        @InjectRepository(Subscriber)
        private repo: Repository<Subscriber>,
    ) {}

    async subscribe(dto: CreateSubscriberDto): Promise<Subscriber> {
        const existing = await this.repo.findOne({ where: { email: dto.email } });
        if (existing) {
            if (!existing.isActive) {
                existing.isActive = true;
                return this.repo.save(existing);
            }
            throw new ConflictException('Email already subscribed');
        }

        const entity = this.repo.create({ email: dto.email, isActive: true });
        return this.repo.save(entity);
    }

    async findAll(): Promise<Subscriber[]> {
        return this.repo.find({ order: { subscribedAt: 'DESC' } });
    }

    async findOne(id: string): Promise<Subscriber> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Subscriber not found');
        return entity;
    }

    async update(id: string, dto: UpdateSubscriberDto): Promise<Subscriber> {
        await this.repo.update(id, dto as any);
        return this.findOne(id);
    }

    async remove(id: string): Promise<void> {
        const result = await this.repo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Subscriber not found');
    }

    async unsubscribe(id: string): Promise<Subscriber> {
        const entity = await this.repo.findOne({ where: { id } });
        if (!entity) throw new NotFoundException('Subscriber not found');
        entity.isActive = false;
        return this.repo.save(entity);
    }

    async sendUpdate(dto: SendUpdateDto): Promise<{ sent: number; total: number }> {
        let subscribers: Subscriber[];
        if (dto.subscriberIds?.length) {
            subscribers = await this.repo.find({ where: { id: In(dto.subscriberIds) } });
        } else {
            subscribers = await this.repo.find({ where: { isActive: true } });
        }
        const total = subscribers.length;
        let sent = 0;

        for (const sub of subscribers) {
            try {
                this.logger.log(`
        ======================================
        SENDING UPDATE TO SUBSCRIBER
        ======================================
        To: ${sub.email}
        Subject: ${dto.subject}
        Message: ${dto.message}
        ${dto.html ? `HTML: ${dto.html.substring(0, 100)}...` : ''}
        ======================================
        `);
                sent++;
            } catch (err) {
                this.logger.error(`Failed to send to ${sub.email}: ${err.message}`);
            }
        }

        this.logger.log(`Broadcast complete: ${sent}/${total} emails sent`);
        return { sent, total };
    }
}
