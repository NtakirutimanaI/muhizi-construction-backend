import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Profile } from './entities/profile.entity';
import { ContactMessage } from './entities/contact-message.entity';
import { Visitor } from './entities/visitor.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { EventsGateway } from '../events/events.gateway';
import { NotificationService } from '../notification/services/notification.service';
import { NotificationType } from '../notification/entities/notification.entity';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private profileRepository: Repository<Profile>,
        @InjectRepository(ContactMessage)
        private contactMessageRepository: Repository<ContactMessage>,
        @InjectRepository(Visitor)
        private visitorRepository: Repository<Visitor>,
        private eventsGateway: EventsGateway,
        private notificationService: NotificationService,
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

        return {
            projects: projectsCount,
            skills: skillsCount,
            messages: contactMessagesCount,
            unreadMessages: unreadMessagesCount,
            certifications: certificationsCount,
            experience: experienceCount,
            education: educationCount,
            languages: languagesCount,
            views: 0,
            clients: 0,
        };
    }

    async getPublicProfile(username?: string) {
        // Get company profile (or profile by username)
        const profile = await this.profileRepository.findOne({
            where: username ? { user: { username } } : {},
            relations: ['user'],
            order: { createdAt: 'ASC' }, // Get first profile if no username provided
        });

        if (!profile) {
            throw new NotFoundException('Profile not found');
        }

        // Return profile without sensitive user data
        const { user, ...profileData } = profile;
        return {
            ...profileData,
            username: user.username,
        };
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
        try {
            console.log('=== UPDATE PROFILE START ===');
            console.log('User ID:', userId);
            console.log('Update Data:', JSON.stringify(updateProfileDto, null, 2));

            const profile = await this.getProfile(userId);
            console.log('Profile found:', profile.id);

            Object.assign(profile, updateProfileDto);
            console.log('Profile updated, saving to database...');

            const updatedProfile = await this.profileRepository.save(profile);
            console.log('✅ Profile saved successfully to database');

            // Create internal notification
            try {
                await this.notificationService.create({
                    type: NotificationType.PROFILE_UPDATE,
                    title: 'Profile Updated',
                    message: `You updated your profile with changes to: ${Object.keys(updateProfileDto).join(', ')}`,
                    user: { id: userId },
                    metadata: { changes: Object.keys(updateProfileDto) }
                });
            } catch (notifyError) {
                console.warn('⚠️ Failed to create internal notification:', notifyError.message);
            }

            // Try to emit real-time event (non-critical)
            if (this.eventsGateway) {
                try {
                    this.eventsGateway.emitToUser(userId, 'profile-updated', {
                        message: 'Profile updated successfully',
                        profile: updatedProfile,
                    });
                    console.log('✅ Event emitted');
                } catch (eventError) {
                    console.warn('⚠️ Event error (non-critical):', eventError.message);
                }
            }

            console.log('=== UPDATE PROFILE SUCCESS ===');
            return updatedProfile;
        } catch (error) {
            console.error('=== UPDATE PROFILE ERROR ===');
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            console.error('Error details:', error);
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

        return {
            total,
            last30Days,
            last7Days,
            today: todayVisits,
            companies,
            locations,
            pages,
        };
    }
}
