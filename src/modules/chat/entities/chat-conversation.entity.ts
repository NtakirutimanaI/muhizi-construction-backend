import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ChatMessage } from './chat-message.entity';

@Entity('chat_conversations')
export class ChatConversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
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
    archived: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
