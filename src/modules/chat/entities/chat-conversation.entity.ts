import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { ChatMessage } from './chat-message.entity';

@Entity('chat_conversations')
export class ChatConversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index('idx_chat_session_id')
    sessionId: string; // Creates a unique ID for the visitor stored in local storage

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    ipAddress: string;

    @Column({ nullable: true })
    device: string;

    @OneToMany(() => ChatMessage, (message) => message.conversation, { cascade: true })
    messages: ChatMessage[];

    @Column({ default: false })
    @Index('idx_chat_archived')
    archived: boolean;

    @CreateDateColumn()
    @Index('idx_chat_created')
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
