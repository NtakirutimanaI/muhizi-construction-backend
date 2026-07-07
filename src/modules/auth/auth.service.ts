import { Injectable, Logger, UnauthorizedException, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from './entities/user.entity';
import { Profile } from '../profile/entities/profile.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { EventsGateway } from '../events/events.gateway';
import { EmailService } from '../../common/services/email.service';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
        private jwtService: JwtService,
        private eventsGateway: EventsGateway,
        private emailService: EmailService,
    ) { }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.userRepository.findOne({
            where: [
                { email: registerDto.email },
                { username: registerDto.username },
            ],
        });

        if (existingUser) {
            throw new ConflictException('Email or username already exists');
        }

        if (registerDto.phone) {
            const existingPhone = await this.profileRepository.findOne({
                where: { phone: registerDto.phone },
            });
            if (existingPhone) {
                throw new ConflictException('Phone number already exists');
            }
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const user = this.userRepository.create({
            email: registerDto.email,
            username: registerDto.username,
            password: hashedPassword,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            role: 'client',
        });

        await this.userRepository.save(user);

        const profile = this.profileRepository.create({
            firstName: registerDto.firstName,
            lastName: registerDto.lastName,
            phone: registerDto.phone,
            user: user,
        });

        await this.profileRepository.save(profile);

        this.eventsGateway.emitToUser(user.id, 'user-registered', {
            message: 'Welcome to the platform!',
        });

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

        if (!user.password) {
            throw new UnauthorizedException('Account registered via Google. Please use Google login.');
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

        const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });
        user.refreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.save(user);

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

    async refresh(refreshDto: RefreshDto) {
        let payload: any;
        try {
            payload = this.jwtService.verify(refreshDto.refreshToken);
        } catch {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        const user = await this.userRepository.findOne({
            where: { id: payload.sub },
            relations: ['profile'],
        });

        if (!user || !user.refreshToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const isRefreshTokenValid = await bcrypt.compare(
            refreshDto.refreshToken,
            user.refreshToken,
        );

        if (!isRefreshTokenValid) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const newPayload = { sub: user.id, email: user.email, role: user.role };
        const newAccessToken = this.jwtService.sign(newPayload);
        const newRefreshToken = this.jwtService.sign(newPayload, { expiresIn: '30d' });

        user.refreshToken = await bcrypt.hash(newRefreshToken, 10);
        await this.userRepository.save(user);

        const { password, ...userData } = user;

        return {
            user: userData,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }

    async logout(userId: string) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.refreshToken = null;
        await this.userRepository.save(user);

        this.eventsGateway.emitToUser(user.id, 'user-logged-out', {
            timestamp: new Date(),
        });

        return { success: true, message: 'Logged out successfully' };
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (!user.password) {
            throw new BadRequestException('Cannot change password for Google-authenticated accounts');
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

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const user = await this.userRepository.findOne({
            where: { email: forgotPasswordDto.email },
        });

        if (!user) {
            return {
                success: true,
                message: 'If the email exists, a password reset OTP has been sent',
            };
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedOtp = await bcrypt.hash(otp, 10);

        user.otpCode = hashedOtp;
        user.otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        await this.userRepository.save(user);

        this.logger.log(`Password reset OTP for ${user.email}: ${otp}`);

        await this.emailService.sendPasswordResetEmail(
            user.email,
            user.username,
            otp,
        );

        this.eventsGateway.emitToUser(user.id, 'password-reset-requested', {
            message: 'Password reset OTP sent',
        });

        return {
            success: true,
            message: 'If the email exists, a password reset OTP has been sent',
        };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const user = await this.userRepository.findOne({
            where: { email: resetPasswordDto.email },
        });

        if (!user) {
            throw new BadRequestException('Invalid or expired OTP');
        }

        if (!user.otpCode || !user.otpExpiresAt) {
            throw new BadRequestException('No OTP requested');
        }

        if (new Date() > user.otpExpiresAt) {
            user.otpCode = null;
            user.otpExpiresAt = null;
            await this.userRepository.save(user);
            throw new BadRequestException('OTP has expired');
        }

        const isOtpValid = await bcrypt.compare(
            resetPasswordDto.otp,
            user.otpCode,
        );

        if (!isOtpValid) {
            throw new BadRequestException('Invalid OTP');
        }

        const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
        user.password = hashedPassword;
        user.otpCode = null;
        user.otpExpiresAt = null;
        await this.userRepository.save(user);

        this.eventsGateway.emitToUser(user.id, 'password-reset-completed', {
            message: 'Password reset successfully',
        });

        return {
            success: true,
            message: 'Password reset successfully',
        };
    }

    async findOrCreateGoogleUser(data: {
        googleId: string;
        email: string;
        firstName: string;
        lastName: string;
        avatar: string | null;
    }) {
        let user = await this.userRepository.findOne({
            where: { email: data.email },
            relations: ['profile'],
        });

        if (user) {
            if (!user.googleId) {
                user.googleId = data.googleId;
                await this.userRepository.save(user);
            }
            return user;
        }

        const username = data.email ? data.email.split('@')[0] + '_' + crypto.randomInt(1000, 9999) : 'google_user_' + crypto.randomInt(100000, 999999);

        user = this.userRepository.create({
            email: data.email,
            username,
            password: null,
            googleId: data.googleId,
            role: 'client',
        });

        await this.userRepository.save(user);

        const profile = this.profileRepository.create({
            firstName: data.firstName,
            lastName: data.lastName,
            avatar: data.avatar ?? undefined,
            user: user,
        });

        await this.profileRepository.save(profile);

        return user;
    }

    async googleLogin(user: any) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '30d' });

        user.refreshToken = await bcrypt.hash(refreshToken, 10);
        await this.userRepository.save(user);

        const fullUser = await this.userRepository.findOne({
            where: { id: user.id },
            relations: ['profile'],
        });

        if (!fullUser) {
            throw new UnauthorizedException('User not found after login');
        }

        const { password, ...userData } = fullUser;

        return {
            user: userData,
            accessToken,
            refreshToken,
        };
    }

    async getAllUsers(requestUserId: string) {
        const users = await this.userRepository.find({
            relations: ['profile'],
            order: { createdAt: 'DESC' },
        });
        return users.map(u => {
            const { password, refreshToken, ...userData } = u;
            return userData;
        });
    }

    async createUser(dto: { email: string; username: string; password: string; firstName: string; lastName: string; role?: string; phone?: string }) {
        const existingUser = await this.userRepository.findOne({
            where: [{ email: dto.email }, { username: dto.username }],
        });
        if (existingUser) {
            throw new ConflictException('Email or username already exists');
        }

        if (dto.phone) {
            const existingPhone = await this.profileRepository.findOne({
                where: { phone: dto.phone },
            });
            if (existingPhone) {
                throw new ConflictException('Phone number already exists');
            }
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const user = this.userRepository.create({
            email: dto.email,
            username: dto.username,
            password: hashedPassword,
            firstName: dto.firstName,
            lastName: dto.lastName,
            role: dto.role || 'employee',
        });
        await this.userRepository.save(user);
        const profile = this.profileRepository.create({
            firstName: dto.firstName,
            lastName: dto.lastName,
            phone: dto.phone,
            user: user,
        });
        await this.profileRepository.save(profile);
        const { password, ...result } = user;
        return result;
    }

    async updateUser(id: string, dto: { email?: string; username?: string; password?: string; role?: string; isActive?: boolean; firstName?: string; lastName?: string; phone?: string }) {
        const user = await this.userRepository.findOne({ where: { id }, relations: ['profile'] });
        if (!user) throw new NotFoundException('User not found');

        if (dto.phone && dto.phone !== user.profile?.phone) {
            const existingPhone = await this.profileRepository.findOne({
                where: { phone: dto.phone },
            });
            if (existingPhone) {
                throw new ConflictException('Phone number already exists');
            }
        }

        if (dto.email !== undefined) user.email = dto.email;
        if (dto.username !== undefined) user.username = dto.username;
        if (dto.firstName !== undefined) user.firstName = dto.firstName;
        if (dto.lastName !== undefined) user.lastName = dto.lastName;
        if (dto.role !== undefined) user.role = dto.role;
        if (dto.isActive !== undefined) user.isActive = dto.isActive;
        if (dto.password) user.password = await bcrypt.hash(dto.password, 10);

        await this.userRepository.save(user);

        if (user.profile && (dto.firstName !== undefined || dto.lastName !== undefined || dto.phone !== undefined)) {
            if (dto.firstName !== undefined) user.profile.firstName = dto.firstName;
            if (dto.lastName !== undefined) user.profile.lastName = dto.lastName;
            if (dto.phone !== undefined) user.profile.phone = dto.phone;
            await this.profileRepository.save(user.profile);
        }

        const { password, refreshToken, ...result } = user;
        return result;
    }

    async removeUser(id: string) {
        const user = await this.userRepository.findOne({ where: { id }, relations: ['profile'] });
        if (!user) throw new NotFoundException('User not found');
        if (user.profile) {
            await this.profileRepository.remove(user.profile);
        }
        await this.userRepository.remove(user);
        return { success: true, message: 'User deleted successfully' };
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
