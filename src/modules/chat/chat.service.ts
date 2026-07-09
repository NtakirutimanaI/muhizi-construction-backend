import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatConversation } from './entities/chat-conversation.entity';
import { ChatMessage } from './entities/chat-message.entity';
import { CreateMessageDto } from './dto/create-message.dto';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatConversation)
        private conversationRepo: Repository<ChatConversation>,
        @InjectRepository(ChatMessage)
        private messageRepo: Repository<ChatMessage>,
        private profileService: ProfileService
    ) { }

    async handleUserMessage(dto: CreateMessageDto) {
        // 1. Find or create conversation
        let conversation = await this.conversationRepo.findOne({
            where: { sessionId: dto.sessionId },
            relations: ['messages']
        });

        if (!conversation) {
            conversation = this.conversationRepo.create({
                sessionId: dto.sessionId,
                email: dto.email,
                location: dto.location,
                ipAddress: dto.ipAddress,
                device: dto.device
            });
            await this.conversationRepo.save(conversation);
            conversation.messages = [];
        } else {
            let changed = false;
            if (dto.email) { conversation.email = dto.email; changed = true; }
            if (dto.location) { conversation.location = dto.location; changed = true; }
            if (dto.ipAddress) { conversation.ipAddress = dto.ipAddress; changed = true; }
            // if (dto.device) { conversation.device = dto.device; changed = true; } // Keep original device usually, or update? Update is fine.

            if (changed) {
                await this.conversationRepo.save(conversation);
            }
        }

        // 2. Save User Message
        const userMsg = this.messageRepo.create({
            content: dto.content,
            sender: 'user',
            conversation: conversation,
            isRead: false
        });
        await this.messageRepo.save(userMsg);

        // 3. Generate Bot Response
        const botResponseContent = await this.generateBotResponse(dto.content);

        // 4. Save Bot Message
        const botMsg = this.messageRepo.create({
            content: botResponseContent,
            sender: 'bot',
            conversation: conversation,
            isRead: true
        });
        await this.messageRepo.save(botMsg);

        // Return latest messages
        return {
            userMessage: userMsg,
            botMessage: botMsg
        };
    }

    async getHistory(sessionId: string) {
        return this.conversationRepo.findOne({
            where: { sessionId },
            relations: ['messages'],
            order: {
                messages: {
                    createdAt: 'ASC'
                }
            } as any
        });
    }

    async getAllConversations() {
        return this.conversationRepo.find({
            relations: ['messages'],
            order: {
                updatedAt: 'DESC'
            }
        });
    }

    async deleteConversation(id: string) {
        const result = await this.conversationRepo.delete(id);
        if (result.affected === 0) throw new NotFoundException('Conversation not found');
        return { message: 'Conversation deleted successfully' };
    }

    private async generateBotResponse(userQuery: string): Promise<string> {
        const query = userQuery.toLowerCase();
        let profile: any = null;
        try {
            profile = await this.profileService.getPublicProfile();
        } catch (e) {
            return "I'm currently updating my system. Please try again later.";
        }

        if (!profile) return "I'm currently updating my system. Please try again later.";

        // --- Intent Classification & Analysis ---

        // 1. Greetings & Basics
        if (query.match(/\b(hi|hello|hey|good morning|good evening)\b/)) {
            return `Hello! I'm MUHIZI CONSTRUCTION virtual assistant. Ask me about our services, projects, or how to get in touch with us.`;
        }

        if (query.match(/\b(who are you|what are you)\b/)) {
            return "I am an AI assistant for MUHIZI CONSTRUCTION - a construction and real estate company. I can help answer your questions about our services and projects.";
        }

        if (query.match(/\b(thank|thanks)\b/)) {
            return "You're welcome! Let me know if you need anything else.";
        }

        // 2. Bio / About
        if (query.match(/\b(about|company|background|summary)\b/)) {
            return profile.bio || `MUHIZI CONSTRUCTION is a construction and real estate company with ${profile.yearsOfExperience} years of experience.`;
        }

        // 3. Contact Information
        if (query.match(/\b(contact|email|phone|address|reach|location)\b/)) {
            const loc = [profile.city, profile.country].filter(Boolean).join(', ');
            return `You can reach us at ${profile.email}. ${profile.phone ? `Call us at ${profile.phone}.` : ''} Location: ${loc || 'Remote'}.`;
        }

        // 4. Hiring / Availability
        if (query.match(/\b(hire|available|job|freelance|work for me)\b/)) {
            return profile.availableForHire
                ? `Yes! MUHIZI CONSTRUCTION is currently available for new projects. Please send a message via the Contact section!`
                : `MUHIZI CONSTRUCTION is not taking new projects right now, but feel free to reach out via the Contact form.`;
        }

        // 5. Skills & Technologies (Deep Search)
        // Flatten all skills into an array
        const allSkills: string[] = [];
        if (profile.skills) {
            Object.values(profile.skills).forEach((group: any) => {
                if (Array.isArray(group)) allSkills.push(...group);
            });
        }

        // Check if query asks for a specific skill
        const matchedSkill = allSkills.find(skill => query.includes(skill.toLowerCase()));
        if (matchedSkill) {
            return `Yes, MUHIZI CONSTRUCTION is experienced with ${matchedSkill}. It is one of our core capabilities.`;
        }

        if (query.match(/\b(skill|stack|tech|technologies|language|framework)\b/)) {
            const topSkills = allSkills.slice(0, 8).join(', ');
            return `MUHIZI CONSTRUCTION works with: ${topSkills} and more.`;
        }

        // 6. Projects (Deep Search)
        if (profile.projects) {
            const matchedProject = profile.projects.find((p: any) => query.includes(p.name.toLowerCase()));
            if (matchedProject) {
                return `The project "${matchedProject.name}" is ${matchedProject.description}. Technologies used: ${matchedProject.technologies.join(', ')}.`;
            }
        }

        if (query.match(/\b(project|portfolio|work|app|website)\b/)) {
            const projectNames = profile.projects?.map((p: any) => p.name).join(', ');
            return `You can check out the Projects section! Some recent work includes: ${projectNames || 'various applications'}.`;
        }

        // 7. Experience / Education
        if (query.match(/\b(experience|history|companies|work|job)\b/)) {
            const lastJob = profile.experience?.[0];
            return `MUHIZI CONSTRUCTION has ${profile.yearsOfExperience} years of experience. ${lastJob ? `Learn more about our work in the Experience section.` : ''}`;
        }

        if (query.match(/\b(education|university|college|degree|study)\b/)) {
            const edu = profile.education?.[0];
            return edu
                ? `Our team studied at ${edu.institution}.`
                : `Our team has a strong educational background in technology.`;
        }

        // 8. Fallback
        return "I'm not exactly sure about that detail, but I can tell you about MUHIZI CONSTRUCTION services, projects, or contact info. What would you like to know?";
    }
}
