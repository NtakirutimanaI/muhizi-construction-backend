import { Injectable, UnauthorizedException, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Profile } from '../profile/entities/profile.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
        private jwtService: JwtService,
        private eventsGateway: EventsGateway,
    ) { }

    async register(registerDto: RegisterDto) {
        // Check if user exists
        const existingUser = await this.userRepository.findOne({
            where: [
                { email: registerDto.email },
                { username: registerDto.username },
            ],
        });

        if (existingUser) {
            throw new ConflictException('Email or username already exists');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        // Create user
        const user = this.userRepository.create({
            email: registerDto.email,
            username: registerDto.username,
            password: hashedPassword,
        });

        await this.userRepository.save(user);

        // Create profile
        const profile = this.profileRepository.create({
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            user: user,
        });

        await this.profileRepository.save(profile);

        // Emit real-time event
        this.eventsGateway.emitToUser(user.id, 'user-registered', {
            message: 'Welcome to the platform!',
        });

        // Return user without password
        const { password, ...result } = user;
        return result;
    }

    async login(loginDto: LoginDto) {
        const user = await this.userRepository.findOne({
            where: { email: loginDto.email },
            relations: ['profile'],
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);

        // Update refresh token
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
        user.refreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.save(user);

        // Emit login event
        this.eventsGateway.emitToUser(user.id, 'user-logged-in', {
            timestamp: new Date(),
        });

        const { password, ...userData } = user;

        return {
            user: userData,
            accessToken,
            refreshToken,
        };
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isPasswordValid = await bcrypt.compare(
            changePasswordDto.currentPassword,
            user.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid current password');
        }

        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
        user.password = hashedPassword;

        await this.userRepository.save(user);

        return {
            success: true,
            message: 'Password changed successfully',
        };
    }

    async getAllUsers(requestUserId: string) {
        const admin = await this.userRepository.findOne({ where: { id: requestUserId } });
        if (!admin || admin.email !== 'info@muhiziconstruction.rw') {
            throw new ForbiddenException('Only the admin can view all users');
        }
        const users = await this.userRepository.find({
            relations: ['profile'],
            order: { createdAt: 'DESC' },
        });
        return users.map(u => {
            const { password, refreshToken, ...userData } = u;
            return userData;
        });
    }

    async validateUser(userId: string): Promise<User> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            relations: ['profile'],
        });

        if (!user) {
            throw new UnauthorizedException('User not found');
        }

        return user;
    }
}
