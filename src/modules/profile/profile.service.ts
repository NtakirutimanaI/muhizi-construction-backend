import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { ContactMessage } from './entities/contact-message.entity';
import { User } from '../auth/entities/user.entity';
import { Role } from '../auth/enums/role.enum';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { EventsGateway } from '../events/events.gateway';
import { NotificationService } from '../notification/services/notification.service';
import { NotificationType } from '../notification/entities/notification.entity';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
        @InjectRepository(ContactMessage)
        private contactMessageRepository: Repository<ContactMessage>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private eventsGateway: EventsGateway,
        private notificationService: NotificationService,
        private cacheService: CacheService,
    ) { }

    async getProfile(userId: string) {
        const profile = await this.profileRepository.findOne({
            where: { user: { id: userId } },
            relations: ['user'],
        });

        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        return profile;
    }

    async getPublicProfile() {
        const cacheKey = 'public_profile_default';
        const cached = this.cacheService.get<any>(cacheKey);
        if (cached) return cached;

        const profile = await this.profileRepository.findOne({
            where: { user: { role: Role.ADMIN }, isPublic: true },
            relations: ['user'],
            order: { updatedAt: 'DESC' },
        });
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        const { user, ...profileData } = profile;
        const result = {
            ...profileData,
        };

        this.cacheService.set(cacheKey, result, 300);
        return result;
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
        try {
            const profile = await this.getProfile(userId);
            const cleaned = Object.fromEntries(
                Object.entries(updateProfileDto as any).filter(([_, v]) => v !== undefined)
            );
            if (updateProfileDto.pageContent !== undefined) {
                profile.pageContent = {
                    ...(profile.pageContent || {}),
                    ...updateProfileDto.pageContent,
                };
                const { pageContent, ...rest } = cleaned as any;
                Object.assign(profile, rest);
            } else {
                Object.assign(profile, cleaned);
            }
            const updatedProfile = await this.profileRepository.save(profile);

            this.cacheService.del('public_profile_default');

            try {
                await this.notificationService.create({
                    type: NotificationType.PROFILE_UPDATE,
                    title: 'Profile Updated',
                    message: `You updated your profile with changes to: ${Object.keys(updateProfileDto).join(', ')}`,
                    user: { id: userId },
                    metadata: { changes: Object.keys(updateProfileDto) }
                });
            } catch (notifyError) {
                console.warn('Failed to create internal notification:', notifyError.message);
            }

            if (this.eventsGateway) {
                try {
                    this.eventsGateway.emitToUser(userId, 'profile-updated', {
                        message: 'Profile updated successfully',
                        profile: updatedProfile,
                    });
                } catch (eventError) {
                    console.warn('Event error (non-critical):', eventError.message);
                }
            }

            return updatedProfile;
        } catch (error) {
            console.error('Profile update error:', error.message);
            throw error;
        }
    }

    async deleteProfile(userId: string) {
        const profile = await this.getProfile(userId);
        await this.profileRepository.remove(profile);

        this.eventsGateway.emitToUser(userId, 'profile-deleted', {
            message: 'Profile deleted successfully',
        });

        return { message: 'Profile deleted successfully' };
    }

    // Contact Message Methods
    async sendContactMessage(sendMessageDto: SendMessageDto, ipAddress?: string) {
        try {
            const message = this.contactMessageRepository.create({
                ...sendMessageDto,
                ipAddress,
            });

            const savedMessage = await this.contactMessageRepository.save(message);

            // Create internal notification for Admin
            try {
                const adminProfile = await this.profileRepository.findOne({
                    relations: ['user'],
                    order: { createdAt: 'ASC' }
                });

                if (adminProfile && adminProfile.user) {
                    await this.notificationService.create({
                        type: NotificationType.ACCOUNT_ACTIVITY,
                        title: 'New Contact Message',
                        message: `New message from ${sendMessageDto.name}: ${sendMessageDto.subject}`,
                        user: { id: adminProfile.user.id },
                        metadata: {
                            messageId: savedMessage.id,
                            email: sendMessageDto.email
                        }
                    });
                }
            } catch (notifyError) {
                console.warn('Failed to create internal notification:', notifyError.message);
            }

            return {
                success: true,
                message: 'Your message has been sent successfully! I will get back to you soon.',
            };
        } catch (error) {
            console.error('Contact message error:', error.message);
            if (error.code === '23505') {
                throw new BadRequestException('A message with this email was recently submitted. Please try again later.');
            }
            throw new BadRequestException('Failed to send message. Please try again.');
        }
    }

    async getContactMessages(userId: string) {
        return this.contactMessageRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async markMessageAsRead(messageId: string) {
        const message = await this.contactMessageRepository.findOne({
            where: { id: messageId },
        });

        if (!message) {
            throw new NotFoundException('Message not found');
        }

        message.status = 'read' as any;
        return this.contactMessageRepository.save(message);
    }

}
