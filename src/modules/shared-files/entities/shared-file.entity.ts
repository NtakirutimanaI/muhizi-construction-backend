import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';

export enum ShareRecipientType {
    SITE_ENGINEER = 'site_engineer',
    PARTNER = 'partner',
    CLIENT = 'client',
}

@Entity('shared_files')
export class SharedFile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'design_id' })
    @Index('idx_shared_file_design')
    designId: string;

    @Column({ name: 'shared_by' })
    @Index('idx_shared_file_shared_by')
    sharedBy: string;

    @Column({ name: 'shared_to' })
    @Index('idx_shared_file_shared_to')
    sharedTo: string;

    @Column({ name: 'recipient_name', nullable: true })
    recipientName: string;

    @Column({ name: 'recipient_type', type: 'varchar', default: ShareRecipientType.SITE_ENGINEER })
    @Index('idx_shared_file_recipient_type')
    recipientType: ShareRecipientType;

    @Column({ name: 'project_id', nullable: true })
    projectId: string;

    @Column({ name: 'project_name', nullable: true })
    projectName: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    @Index('idx_shared_file_created')
    createdAt: Date;
}
