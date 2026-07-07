import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../entities/user.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { EventsGateway } from '../../events/events.gateway';
import { Queue } from 'bull';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
    let service: AuthService;
    let userRepository: any;
    let profileRepository: any;
    let jwtService: JwtService;
    let eventsGateway: EventsGateway;
    let notificationQueue: Queue;

    const mockUser = {
        id: '1',
        email: 'test@example.com',
        username: 'testuser',
        password: 'hashedPassword',
        isActive: true,
        refreshToken: null,
    };

    const mockProfile = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        user: mockUser,
    };

    beforeEach(async () => {
        const mockUserRepository = {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };

        const mockProfileRepository = {
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };

        const mockJwtService = {
            sign: jest.fn(),
        };

        const mockEventsGateway = {
            emitToUser: jest.fn(),
        };

        const mockQueue = {
            add: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
                {
                    provide: getRepositoryToken(Profile),
                    useValue: mockProfileRepository,
                },
                {
                    provide: JwtService,
                    useValue: mockJwtService,
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

        service = module.get<AuthService>(AuthService);
        userRepository = module.get(getRepositoryToken(User));
        profileRepository = module.get(getRepositoryToken(Profile));
        jwtService = module.get<JwtService>(JwtService);
        eventsGateway = module.get<EventsGateway>(EventsGateway);
        notificationQueue = module.get('BullQueue_notifications');
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('register', () => {
        const registerDto = {
            email: 'test@example.com',
            username: 'testuser',
            password: 'password123',
            firstName: 'John',
            lastName: 'Doe',
        };

        it('should successfully register a new user', async () => {
            userRepository.findOne.mockResolvedValue(null);
            userRepository.create.mockReturnValue(mockUser);
            userRepository.save.mockResolvedValue(mockUser);
            profileRepository.create.mockReturnValue(mockProfile);
            profileRepository.save.mockResolvedValue(mockProfile);

            jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedPassword'));

            const result = await service.register(registerDto);

            expect(result).toBeDefined();
            expect(result.email).toBe(registerDto.email);
            expect(userRepository.findOne).toHaveBeenCalled();
            expect(userRepository.save).toHaveBeenCalled();
            expect(profileRepository.save).toHaveBeenCalled();
            expect(notificationQueue.add).toHaveBeenCalledWith('welcome-email', expect.any(Object));
            expect(eventsGateway.emitToUser).toHaveBeenCalled();
        });

        it('should throw ConflictException if user already exists', async () => {
            userRepository.findOne.mockResolvedValue(mockUser);

            await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('login', () => {
        const loginDto = {
            email: 'test@example.com',
            password: 'password123',
        };

        it('should successfully login a user', async () => {
            const userWithProfile = { ...mockUser, profile: mockProfile };
            userRepository.findOne.mockResolvedValue(userWithProfile);
            userRepository.save.mockResolvedValue(userWithProfile);
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));
            jest.spyOn(jwtService, 'sign').mockReturnValue('token');

            const result = await service.login(loginDto);

            expect(result).toBeDefined();
            expect(result.accessToken).toBe('token');
            expect(result.refreshToken).toBe('token');
            expect(result.user).toBeDefined();
            expect(eventsGateway.emitToUser).toHaveBeenCalled();
        });

        it('should throw UnauthorizedException if user not found', async () => {
            userRepository.findOne.mockResolvedValue(null);

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });

        it('should throw UnauthorizedException if password is invalid', async () => {
            userRepository.findOne.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

            await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('validateUser', () => {
        it('should return user if found', async () => {
            const userWithProfile = { ...mockUser, profile: mockProfile };
            userRepository.findOne.mockResolvedValue(userWithProfile);

            const result = await service.validateUser('1');

            expect(result).toBeDefined();
            expect(result.id).toBe('1');
        });

        it('should throw UnauthorizedException if user not found', async () => {
            userRepository.findOne.mockResolvedValue(null);

            await expect(service.validateUser('1')).rejects.toThrow(UnauthorizedException);
        });
    });
});
