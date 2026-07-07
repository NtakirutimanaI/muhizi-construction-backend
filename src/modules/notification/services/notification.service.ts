import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from '../entities/notification.entity';

@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
    ) { }

    async getUserNotifications(userId: string) {
        return this.notificationRepository.find({
            where: { user: { id: userId } },
            order: { createdAt: 'DESC' },
        });
    }

    async getUnreadNotifications(userId: string) {
        return this.notificationRepository.find({
            where: { user: { id: userId }, isRead: false },
            order: { createdAt: 'DESC' },
        });
    }

    async markAsRead(notificationId: string, userId: string) {
        const notification = await this.notificationRepository.findOne({
            where: { id: notificationId, user: { id: userId } },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        notification.isRead = true;
        return this.notificationRepository.save(notification);
    }

    async markAllAsRead(userId: string) {
        await this.notificationRepository.update(
            { user: { id: userId }, isRead: false },
            { isRead: true },
        );

        return { message: 'All notifications marked as read' };
    }

    async deleteNotification(notificationId: string, userId: string) {
        const notification = await this.notificationRepository.findOne({
            where: { id: notificationId, user: { id: userId } },
        });

        if (!notification) {
            throw new NotFoundException('Notification not found');
        }

        await this.notificationRepository.remove(notification);
        return { message: 'Notification deleted successfully' };
    }
    async create(data: {
        type: NotificationType;
        title: string;
        message: string;
        user: { id: string };
        metadata?: any;
    }) {
        const notification = this.notificationRepository.create(data);
        return await this.notificationRepository.save(notification);
    }
}
