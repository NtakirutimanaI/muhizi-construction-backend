import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index } from 'typeorm';
import { ChatConversation } from './chat-conversation.entity';

@Entity('chat_messages')
export class ChatMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    content: string;

    @Column({ enum: ['user', 'bot', 'admin'], default: 'user' })
    @Index('idx_msg_sender')
    sender: 'user' | 'bot' | 'admin';

    @Column({ default: false })
    @Index('idx_msg_is_read')
    isRead: boolean;

    @ManyToOne(() => ChatConversation, (conversation) => conversation.messages, { onDelete: 'CASCADE' })
    conversation: ChatConversation;

    @CreateDateColumn()
    @Index('idx_msg_created')
    createdAt: Date;
}
