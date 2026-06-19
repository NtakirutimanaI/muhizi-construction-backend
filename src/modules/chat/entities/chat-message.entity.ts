import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { ChatConversation } from './chat-conversation.entity';

@Entity('chat_messages')
export class ChatMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @Column({ enum: ['user', 'bot', 'admin'], default: 'user' })
    sender: 'user' | 'bot' | 'admin';

    @ManyToOne(() => ChatConversation, (conversation) => conversation.messages, { onDelete: 'CASCADE' })
    conversation: ChatConversation;

    @Column({ default: false })
    isRead: boolean; // For admin dashboard notifications

    @CreateDateColumn()
    createdAt: Date;
}
