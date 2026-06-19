import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

export enum NotificationType {
    PROFILE_UPDATE = 'profile_update',
    WELCOME = 'welcome',
    PASSWORD_RESET = 'password_reset',
    ACCOUNT_ACTIVITY = 'account_activity',
    SYSTEM = 'system',
}

export enum NotificationStatus {
    PENDING = 'pending',
    SENT = 'sent',
    FAILED = 'failed',
}

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'enum',
        enum: NotificationType,
    })
    type: NotificationType;

    @Column()
    title: string;

    @Column('text')
    message: string;

    @Column({
        type: 'enum',
        enum: NotificationStatus,
        default: NotificationStatus.PENDING,
    })
    status: NotificationStatus;

    @Column({ default: false })
    isRead: boolean;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, any>;

    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ nullable: true })
    sentAt: Date;
}
