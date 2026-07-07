import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import { Notification } from '../entities/notification.entity';

describe('NotificationService', () => {
    let service: NotificationService;
    let notificationRepository: any;

    const mockNotification = {
        id: '1',
        type: 'welcome',
        title: 'Welcome!',
        message: 'Welcome to our platform',
        status: 'sent',
        isRead: false,
        metadata: null,
        user: {
            id: 'user-1',
        },
        createdAt: new Date(),
        sentAt: new Date(),
    };

    beforeEach(async () => {
        const mockNotificationRepository = {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationService,
                {
                    provide: getRepositoryToken(Notification),
                    useValue: mockNotificationRepository,
                },
            ],
        }).compile();

        service = module.get<NotificationService>(NotificationService);
        notificationRepository = module.get(getRepositoryToken(Notification));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getUserNotifications', () => {
        it('should return all notifications for a user', async () => {
            const notifications = [mockNotification, { ...mockNotification, id: '2' }];
            notificationRepository.find.mockResolvedValue(notifications);

            const result = await service.getUserNotifications('user-1');

            expect(result).toBeDefined();
            expect(result.length).toBe(2);
            expect(notificationRepository.find).toHaveBeenCalledWith({
                where: { user: { id: 'user-1' } },
                order: { createdAt: 'DESC' },
            });
        });
    });

    describe('getUnreadNotifications', () => {
        it('should return only unread notifications for a user', async () => {
            const unreadNotifications = [mockNotification];
            notificationRepository.find.mockResolvedValue(unreadNotifications);

            const result = await service.getUnreadNotifications('user-1');

            expect(result).toBeDefined();
            expect(result.length).toBe(1);
            expect(notificationRepository.find).toHaveBeenCalledWith({
                where: { user: { id: 'user-1' }, isRead: false },
                order: { createdAt: 'DESC' },
            });
        });
    });

    describe('markAsRead', () => {
        it('should mark a notification as read', async () => {
            const readNotification = { ...mockNotification, isRead: true };
            notificationRepository.findOne.mockResolvedValue(mockNotification);
            notificationRepository.save.mockResolvedValue(readNotification);

            const result = await service.markAsRead('1', 'user-1');

            expect(result).toBeDefined();
            expect(result.isRead).toBe(true);
            expect(notificationRepository.save).toHaveBeenCalled();
        });

        it('should throw NotFoundException if notification not found', async () => {
            notificationRepository.findOne.mockResolvedValue(null);

            await expect(service.markAsRead('1', 'user-1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('markAllAsRead', () => {
        it('should mark all notifications as read for a user', async () => {
            notificationRepository.update.mockResolvedValue({ affected: 3 });

            const result = await service.markAllAsRead('user-1');

            expect(result).toBeDefined();
            expect(result.message).toBe('All notifications marked as read');
            expect(notificationRepository.update).toHaveBeenCalledWith(
                { user: { id: 'user-1' }, isRead: false },
                { isRead: true },
            );
        });
    });

    describe('deleteNotification', () => {
        it('should delete a notification', async () => {
            notificationRepository.findOne.mockResolvedValue(mockNotification);
            notificationRepository.remove.mockResolvedValue(mockNotification);

            const result = await service.deleteNotification('1', 'user-1');

            expect(result).toBeDefined();
            expect(result.message).toBe('Notification deleted successfully');
            expect(notificationRepository.remove).toHaveBeenCalledWith(mockNotification);
        });

        it('should throw NotFoundException if notification not found', async () => {
            notificationRepository.findOne.mockResolvedValue(null);

            await expect(service.deleteNotification('1', 'user-1')).rejects.toThrow(NotFoundException);
        });
    });
});
