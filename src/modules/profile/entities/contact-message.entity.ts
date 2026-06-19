import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
} from 'typeorm';

export enum MessageStatus {
    NEW = 'new',
    READ = 'read',
    REPLIED = 'replied',
    ARCHIVED = 'archived',
}

@Entity('contact_messages')
export class ContactMessage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
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
    status: MessageStatus;

    @Column({ nullable: true })
    ipAddress: string;

    @CreateDateColumn()
    createdAt: Date;
}
