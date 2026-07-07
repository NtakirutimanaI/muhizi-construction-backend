import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, IsNull, Not } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { ContactMessage, MessageStatus } from './entities/contact-message.entity';
import { Visitor } from './entities/visitor.entity';
import { User } from '../auth/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { SendAdminMessageDto } from './dto/send-admin-message.dto';
import { EventsGateway } from '../events/events.gateway';
import { NotificationService } from '../notification/services/notification.service';
import { NotificationType } from '../notification/entities/notification.entity';
import { CacheService } from '../cache/cache.service';
import { AuditService } from '../audit/audit.service';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
        @InjectRepository(ContactMessage)
        private contactMessageRepository: Repository<ContactMessage>,
        @InjectRepository(Visitor)
        private visitorRepository: Repository<Visitor>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private eventsGateway: EventsGateway,
        private notificationService: NotificationService,
        private cacheService: CacheService,
        private auditService: AuditService,
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

    async getStats(userId: string) {
        const profile = await this.getProfile(userId);
        const contactMessagesCount = await this.contactMessageRepository.count();
        const unreadMessagesCount = await this.contactMessageRepository.count({
            where: { status: 'new' as any },
        });

        const projectsCount = profile.projects ? profile.projects.length : 0;

        let skillsCount = 0;
        if (profile.skills) {
            skillsCount = Object.values(profile.skills).reduce((acc: number, curr: string[]) => acc + curr.length, 0);
        }

        const certificationsCount = profile.certifications ? profile.certifications.length : 0;
        const experienceCount = profile.experience ? profile.experience.length : 0;
        const educationCount = profile.education ? profile.education.length : 0;
        const languagesCount = profile.languages ? profile.languages.length : 0;

        const viewsCount = await this.visitorRepository.count();
        const clientsCount = await this.userRepository.count({ where: { role: 'client' as any } });

        return {
            projects: projectsCount,
            skills: skillsCount,
            messages: contactMessagesCount,
            unreadMessages: unreadMessagesCount,
            certifications: certificationsCount,
            experience: experienceCount,
            education: educationCount,
            languages: languagesCount,
            views: viewsCount,
            clients: clientsCount,
        };
    }

    async getPublicProfile(username?: string) {
        const cacheKey = `public_profile_${username || 'default'}`;
        const cached = this.cacheService.get<any>(cacheKey);
        if (cached) return cached;

        let profile;
        if (!username) {
            profile = await this.profileRepository.findOne({
                where: { isPublic: true },
                relations: ['user'],
                order: { updatedAt: 'DESC' },
            });
        }
        if (!profile) {
            profile = await this.profileRepository.findOne({
                where: username ? { user: { username } } : { isPublic: true },
                relations: ['user'],
                order: { updatedAt: 'DESC' },
            });
        }
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        const { user, ...profileData } = profile;
        const result = {
            ...profileData,
            username: user.username,
        };

        this.cacheService.set(cacheKey, result, 300);
        return result;
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto, userEmail?: string, userRole?: string, ipAddress?: string) {
        try {
            const profile = await this.getProfile(userId);
            if (updateProfileDto.pageContent !== undefined) {
                profile.pageContent = {
                    ...(profile.pageContent || {}),
                    ...updateProfileDto.pageContent,
                };
                const { pageContent, ...rest } = updateProfileDto as any;
                Object.assign(profile, rest);
            } else {
                Object.assign(profile, updateProfileDto);
            }
            const updatedProfile = await this.profileRepository.save(profile);

            this.cacheService.del('public_profile_default');
            this.cacheService.del(`public_profile_${profile.user?.username}`);

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

            this.auditService.log({
                userId,
                userEmail,
                userRole,
                action: 'profile.update',
                entity: 'Profile',
                entityId: profile.id,
                metadata: { changes: Object.keys(updateProfileDto) },
                ipAddress,
            });

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

    async getAllProfiles() {
        return this.profileRepository.find({
            relations: ['user'],
            select: {
                user: {
                    id: true,
                    email: true,
                    username: true,
                },
            },
        });
    }

    // Contact Message Methods
    async sendContactMessage(sendMessageDto: SendMessageDto, ipAddress?: string) {
        try {
            console.log('=== CONTACT MESSAGE RECEIVED ===');
            console.log('Message Data:', JSON.stringify(sendMessageDto, null, 2));
            console.log('IP Address:', ipAddress);

            const message = this.contactMessageRepository.create({
                ...sendMessageDto,
                ipAddress,
            });

            const savedMessage = await this.contactMessageRepository.save(message);
            console.log('✅ Contact message saved to database:', savedMessage.id);

            // Create internal notification for Admin
            try {
                // Get the admin user (profile owner)
                const adminProfile = await this.profileRepository.findOne({
                    relations: ['user'],
                    order: { createdAt: 'ASC' }
                });

                if (adminProfile && adminProfile.user) {
                    await this.notificationService.create({
                        type: NotificationType.ACCOUNT_ACTIVITY, // Closest matching type
                        title: 'New Contact Message',
                        message: `New message from ${sendMessageDto.name}: ${sendMessageDto.subject}`,
                        user: { id: adminProfile.user.id },
                        metadata: {
                            messageId: savedMessage.id,
                            email: sendMessageDto.email
                        }
                    });
                    console.log('✅ Internal notification created for admin');
                }
            } catch (notifyError) {
                console.warn('⚠️ Failed to create internal notification:', notifyError.message);
            }

            console.log('=== CONTACT MESSAGE SUCCESS ===');
            return {
                success: true,
                message: 'Your message has been sent successfully! I will get back to you soon.',
            };
        } catch (error) {
            console.error('=== CONTACT MESSAGE ERROR ===');
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            throw error;
        }
    }

    async getContactMessages(userId: string) {
        // Only allow authenticated users (admin) to view messages
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

    async deleteAllMessages() {
        await this.contactMessageRepository.clear();
        return { message: 'All messages deleted successfully' };
    }

    // Admin compose & send message
    async sendAdminMessage(sendAdminMessageDto: SendAdminMessageDto, senderId: string) {
        const message = this.contactMessageRepository.create({
            ...sendAdminMessageDto,
            status: MessageStatus.SENT,
            sender: { id: senderId } as any,
        });
        const saved = await this.contactMessageRepository.save(message);
        try {
            const adminProfile = await this.profileRepository.findOne({ relations: ['user'], order: { createdAt: 'ASC' } });
            if (adminProfile?.user) {
                await this.notificationService.create({
                    type: NotificationType.ACCOUNT_ACTIVITY,
                    title: 'Message Sent',
                    message: `Admin replied to ${sendAdminMessageDto.name}: ${sendAdminMessageDto.subject || 'No subject'}`,
                    user: { id: adminProfile.user.id },
                    metadata: { messageId: saved.id, email: sendAdminMessageDto.email },
                });
            }
        } catch { }
        return saved;
    }

    // Inbox: non-deleted messages from contact form (no sender)
    async getInboxMessages() {
        try {
            return await this.contactMessageRepository.find({
                where: { isDeleted: false, senderId: IsNull() },
                order: { createdAt: 'DESC' },
            });
        } catch (error) {
            return this.contactMessageRepository.find({
                order: { createdAt: 'DESC' },
            });
        }
    }

    // Sent: messages sent by admin (has sender)
    async getSentMessages() {
        try {
            return await this.contactMessageRepository.find({
                where: { senderId: Not(IsNull()), isDeleted: false },
                relations: ['sender'],
                order: { createdAt: 'DESC' },
            });
        } catch (error) {
            return [];
        }
    }

    // Trash: soft-deleted messages
    async getTrashMessages() {
        return this.contactMessageRepository.find({
            where: { isDeleted: true },
            order: { deletedAt: 'DESC' },
        });
    }

    // Soft delete (move to trash)
    async trashMessage(messageId: string) {
        const message = await this.contactMessageRepository.findOne({ where: { id: messageId } });
        if (!message) throw new NotFoundException('Message not found');
        message.isDeleted = true;
        message.deletedAt = new Date();
        return this.contactMessageRepository.save(message);
    }

    // Restore from trash
    async restoreMessage(messageId: string) {
        const message = await this.contactMessageRepository.findOne({ where: { id: messageId } });
        if (!message) throw new NotFoundException('Message not found');
        message.isDeleted = false;
        message.deletedAt = null;
        return this.contactMessageRepository.save(message);
    }

    // Permanently delete
    async permanentDeleteMessage(messageId: string) {
        const message = await this.contactMessageRepository.findOne({ where: { id: messageId } });
        if (!message) throw new NotFoundException('Message not found');
        return this.contactMessageRepository.remove(message);
    }

    // ───── Visitor Methods ─────

    async recordVisit(dto: { name?: string; email?: string; company?: string; location?: string; page?: string; referrer?: string }, ipAddress?: string, userAgent?: string) {
        const visit = this.visitorRepository.create({
            ...dto,
            ipAddress,
            userAgent,
        });
        return this.visitorRepository.save(visit);
    }

    async getVisitors(page = 1, limit = 20) {
        const [visitors, total] = await this.visitorRepository.findAndCount({
            order: { visitedAt: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { visitors, total, page, limit };
    }

    async getVisitorStats() {
        const cacheKey = 'visitor_stats';
        const cached = this.cacheService.get<any>(cacheKey);
        if (cached) return cached;

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const total = await this.visitorRepository.count();
        const last30Days = await this.visitorRepository.count({ where: { visitedAt: Between(thirtyDaysAgo, new Date()) } });
        const last7Days = await this.visitorRepository.count({ where: { visitedAt: Between(sevenDaysAgo, new Date()) } });

        const companies = await this.visitorRepository
            .createQueryBuilder('v')
            .select('v.company', 'company')
            .addSelect('COUNT(v.id)', 'count')
            .where('v.company IS NOT NULL')
            .andWhere("v.company != ''")
            .groupBy('v.company')
            .orderBy('COUNT(v.id)', 'DESC')
            .limit(10)
            .getRawMany();

        const locations = await this.visitorRepository
            .createQueryBuilder('v')
            .select('v.location', 'location')
            .addSelect('COUNT(v.id)', 'count')
            .where('v.location IS NOT NULL')
            .andWhere("v.location != ''")
            .groupBy('v.location')
            .orderBy('COUNT(v.id)', 'DESC')
            .limit(10)
            .getRawMany();

        const pages = await this.visitorRepository
            .createQueryBuilder('v')
            .select('v.page', 'page')
            .addSelect('COUNT(v.id)', 'count')
            .where('v.page IS NOT NULL')
            .groupBy('v.page')
            .orderBy('COUNT(v.id)', 'DESC')
            .getRawMany();

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayVisits = await this.visitorRepository.count({ where: { visitedAt: Between(today, new Date()) } });

        const result = { total, last30Days, last7Days, today: todayVisits, companies, locations, pages };
        this.cacheService.set(cacheKey, result, 120);
        return result;
    }
}
