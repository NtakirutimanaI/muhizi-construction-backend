import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum MessageStatus {
    NEW = 'new',
    READ = 'read',
    REPLIED = 'replied',
    ARCHIVED = 'archived',
    SENT = 'sent',
}

@Entity('contact_messages')
export class ContactMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    @Index('idx_contact_email')
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    company: string;

    @Column({ nullable: true })
    subject: string;

    @Column('text')
    message: string;

    @Column({
        type: 'enum',
        enum: MessageStatus,
        default: MessageStatus.NEW,
    })
    @Index('idx_contact_status')
    status: MessageStatus;

    @Column({ nullable: true })
    @Index('idx_contact_ip')
    ipAddress: string;

    @CreateDateColumn()
    @Index('idx_contact_created')
    createdAt: Date;

    @Column({ default: false })
    @Index('idx_contact_deleted')
    isDeleted: boolean;

    @Column({ nullable: true })
    deletedAt: Date | null;

    @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'senderId' })
    sender: User;

    @Column({ nullable: true })
    senderId: string;
}
