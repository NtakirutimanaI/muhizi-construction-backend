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

    @Column()
    title: string;

    @Column('text')
    message: string;

    @Column({
        type: 'enum',
        enum: NotificationType,
    })
    @Index('idx_notif_type')
    type: NotificationType;

    @Column({
        type: 'enum',
        enum: NotificationStatus,
        default: NotificationStatus.PENDING,
    })
    @Index('idx_notif_status')
    status: NotificationStatus;

    @Column({ default: false })
    @Index('idx_notif_is_read')
    isRead: boolean;

    @Column({ nullable: true })
    sentAt: Date;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, any>;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @CreateDateColumn()
    @Index('idx_notif_created')
    createdAt: Date;
}
