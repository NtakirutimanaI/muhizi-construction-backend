import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType, NotificationStatus } from '../entities/notification.entity';
import { User } from '../../auth/entities/user.entity';

@Processor('notifications')
export class NotificationProcessor {
    private readonly logger = new Logger(NotificationProcessor.name);

    constructor(
        @InjectRepository(Notification)
        private notificationRepository: Repository<Notification>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    @Process('welcome-email')
    async handleWelcomeEmail(job: Job) {
        this.logger.log(`Processing welcome email for user ${job.data.userId}`);

        try {
            const user = await this.userRepository.findOne({
                where: { id: job.data.userId },
            });

            if (!user) {
                throw new Error('User not found');
            }

            // Create notification record
            const notification = this.notificationRepository.create({
                type: NotificationType.WELCOME,
                title: 'Welcome!',
                message: `Welcome to our platform, ${job.data.name}! We're excited to have you here.`,
                user: user,
                status: NotificationStatus.SENT,
                sentAt: new Date(),
            });

            await this.notificationRepository.save(notification);

            // Here you would integrate with an email service (SendGrid, AWS SES, etc.)
            this.logger.log(`Welcome email sent to ${job.data.email}`);

            return { success: true, email: job.data.email };
        } catch (error) {
            this.logger.error(`Failed to send welcome email: ${error.message}`);
            throw error;
        }
    }

    @Process('profile-updated')
    async handleProfileUpdate(job: Job) {
        this.logger.log(`Processing profile update notification for user ${job.data.userId}`);

        try {
            const user = await this.userRepository.findOne({
                where: { id: job.data.userId },
            });

            if (!user) {
                throw new Error('User not found');
            }

            const notification = this.notificationRepository.create({
                type: NotificationType.PROFILE_UPDATE,
                title: 'Profile Updated',
                message: `Your profile has been successfully updated. Changes: ${job.data.changes.join(', ')}`,
                user: user,
                status: NotificationStatus.SENT,
                sentAt: new Date(),
                metadata: {
                    changes: job.data.changes,
                },
            });

            await this.notificationRepository.save(notification);

            this.logger.log(`Profile update notification created for user ${job.data.userId}`);

            return { success: true };
        } catch (error) {
            this.logger.error(`Failed to create profile update notification: ${error.message}`);
            throw error;
        }
    }

    @Process('system-notification')
    async handleSystemNotification(job: Job) {
        this.logger.log(`Processing system notification`);

        try {
            const { userId, title, message, metadata } = job.data;

            const user = await this.userRepository.findOne({
                where: { id: userId },
            });

            if (!user) {
                throw new Error('User not found');
            }

            const notification = this.notificationRepository.create({
                type: NotificationType.SYSTEM,
                title,
                message,
                user: user,
                status: NotificationStatus.SENT,
                sentAt: new Date(),
                metadata,
            });

            await this.notificationRepository.save(notification);

            this.logger.log(`System notification created for user ${userId}`);

            return { success: true };
        } catch (error) {
            this.logger.error(`Failed to create system notification: ${error.message}`);
            throw error;
        }
    }
}
