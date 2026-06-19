import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { EventsGateway } from '../../events/events.gateway';

@Injectable()
export class NotificationCronService {
    private readonly logger = new Logger(NotificationCronService.name);

    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
        private eventsGateway: EventsGateway,
    ) { }

    // Run every day at midnight to clean up old notifications
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async cleanupOldNotifications() {
        this.logger.log('Running cleanup job for old notifications');

        try {
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

            const result = await this.notificationRepository.delete({
                createdAt: LessThan(thirtyDaysAgo),
                isRead: true,
            });

            this.logger.log(`Deleted ${result.affected} old notifications`);

            // Broadcast to admins
            this.eventsGateway.broadcastToAll('notification-cleanup', {
                deletedCount: result.affected,
                timestamp: new Date(),
            });
        } catch (error) {
            this.logger.error(`Failed to cleanup old notifications: ${error.message}`);
        }
    }

    // Run every hour to send digest of unread notifications
    @Cron(CronExpression.EVERY_HOUR)
    async sendUnreadDigest() {
        this.logger.log('Running unread notifications digest job');

        try {
            const unreadNotifications = await this.notificationRepository
                .createQueryBuilder('notification')
                .leftJoinAndSelect('notification.user', 'user')
                .where('notification.isRead = :isRead', { isRead: false })
                .getMany();

            // Group by user
            const notificationsByUser = unreadNotifications.reduce((acc, notification) => {
                const userId = notification.user.id;
                if (!acc[userId]) {
                    acc[userId] = [];
                }
                acc[userId].push(notification);
                return acc;
            }, {});

            // Send digest to each user
            for (const [userId, notifications] of Object.entries(notificationsByUser)) {
                this.eventsGateway.emitToUser(userId, 'unread-digest', {
                    count: (notifications as any[]).length,
                    notifications: notifications,
                });
            }

            this.logger.log(`Sent unread digest to ${Object.keys(notificationsByUser).length} users`);
        } catch (error) {
            this.logger.error(`Failed to send unread digest: ${error.message}`);
        }
    }

    // Run every 5 minutes to check for stuck pending notifications
    @Cron(CronExpression.EVERY_5_MINUTES)
    async checkPendingNotifications() {
        this.logger.log('Checking for stuck pending notifications');

        try {
            const tenMinutesAgo = new Date();
            tenMinutesAgo.setMinutes(tenMinutesAgo.getMinutes() - 10);

            const stuckNotifications = await this.notificationRepository.find({
                where: {
                    status: 'pending' as any,
                    createdAt: LessThan(tenMinutesAgo),
                },
            });

            if (stuckNotifications.length > 0) {
                this.logger.warn(`Found ${stuckNotifications.length} stuck pending notifications`);

                // You could retry sending them or mark them as failed
                // For now, we'll just log them
            }
        } catch (error) {
            this.logger.error(`Failed to check pending notifications: ${error.message}`);
        }
    }
}
