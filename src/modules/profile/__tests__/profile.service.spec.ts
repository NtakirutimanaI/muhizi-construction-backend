import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ProfileService } from '../profile.service';
import { Profile } from '../entities/profile.entity';
import { EventsGateway } from '../../events/events.gateway';
import { Queue } from 'bull';

describe('ProfileService', () => {
    let service: ProfileService;
    let profileRepository: any;
    let eventsGateway: EventsGateway;
    let notificationQueue: Queue;

    const mockProfile = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        avatar: null,
        bio: null,
        phone: null,
        dateOfBirth: null,
        address: null,
        city: null,
        country: null,
        zipCode: null,
        socialLinks: null,
        user: {
            id: 'user-1',
            email: 'test@example.com',
            username: 'testuser',
        },
    };

    beforeEach(async () => {
        const mockProfileRepository = {
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
        };

        const mockEventsGateway = {
            emitToUser: jest.fn(),
        };

        const mockQueue = {
            add: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProfileService,
                {
                    provide: getRepositoryToken(Profile),
                    useValue: mockProfileRepository,
                },
                {
                    provide: EventsGateway,
                    useValue: mockEventsGateway,
                },
                {
                    provide: 'BullQueue_notifications',
                    useValue: mockQueue,
                },
            ],
        }).compile();

        service = module.get<ProfileService>(ProfileService);
        profileRepository = module.get(getRepositoryToken(Profile));
        eventsGateway = module.get<EventsGateway>(EventsGateway);
        notificationQueue = module.get('BullQueue_notifications');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getProfile', () => {
        it('should return a profile for a valid user', async () => {
            profileRepository.findOne.mockResolvedValue(mockProfile);

            const result = await service.getProfile('user-1');

            expect(result).toBeDefined();
            expect(result.id).toBe('1');
            expect(profileRepository.findOne).toHaveBeenCalledWith({
                where: { user: { id: 'user-1' } },
                relations: ['user'],
            });
        });

        it('should throw NotFoundException if profile not found', async () => {
            profileRepository.findOne.mockResolvedValue(null);

            await expect(service.getProfile('user-1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('updateProfile', () => {
        const updateDto = {
            firstName: 'Jane',
            bio: 'Updated bio',
            city: 'New York',
        };

        it('should successfully update a profile', async () => {
            const updatedProfile = { ...mockProfile, ...updateDto };
            profileRepository.findOne.mockResolvedValue(mockProfile);
            profileRepository.save.mockResolvedValue(updatedProfile);

            const result = await service.updateProfile('user-1', updateDto);

            expect(result).toBeDefined();
            expect(result.firstName).toBe('Jane');
            expect(profileRepository.save).toHaveBeenCalled();
            expect(notificationQueue.add).toHaveBeenCalledWith('profile-updated', {
                userId: 'user-1',
                changes: Object.keys(updateDto),
            });
            expect(eventsGateway.emitToUser).toHaveBeenCalledWith('user-1', 'profile-updated', expect.any(Object));
        });

        it('should throw NotFoundException if profile not found', async () => {
            profileRepository.findOne.mockResolvedValue(null);

            await expect(service.updateProfile('user-1', updateDto)).rejects.toThrow(NotFoundException);
        });
    });

    describe('deleteProfile', () => {
        it('should successfully delete a profile', async () => {
            profileRepository.findOne.mockResolvedValue(mockProfile);
            profileRepository.remove.mockResolvedValue(mockProfile);

            const result = await service.deleteProfile('user-1');

            expect(result).toBeDefined();
            expect(result.message).toBe('Profile deleted successfully');
            expect(profileRepository.remove).toHaveBeenCalledWith(mockProfile);
            expect(eventsGateway.emitToUser).toHaveBeenCalledWith('user-1', 'profile-deleted', expect.any(Object));
        });

        it('should throw NotFoundException if profile not found', async () => {
            profileRepository.findOne.mockResolvedValue(null);

            await expect(service.deleteProfile('user-1')).rejects.toThrow(NotFoundException);
        });
    });

    describe('getAllProfiles', () => {
        it('should return all profiles', async () => {
            const profiles = [mockProfile, { ...mockProfile, id: '2' }];
            profileRepository.find.mockResolvedValue(profiles);

            const result = await service.getAllProfiles();

            expect(result).toBeDefined();
            expect(result.length).toBe(2);
            expect(profileRepository.find).toHaveBeenCalledWith({
                relations: ['user'],
                select: {
                    user: {
                        id: true,
                        email: true,
                        username: true,
                    },
                },
            });
        });
    });
});
