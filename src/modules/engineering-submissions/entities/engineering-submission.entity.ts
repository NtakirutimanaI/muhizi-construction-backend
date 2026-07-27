import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum SubmissionStatus {
    SUBMITTED = 'submitted',
    REVIEWED = 'reviewed',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    CORRECTIONS_REQUESTED = 'corrections_requested',
}

@Entity('engineering_submissions')
export class EngineeringSubmission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'json', default: [] })
    documentUrls: { name: string; url: string; type: string }[];

    @Column({ type: 'varchar', default: SubmissionStatus.SUBMITTED })
    status: string;

    @Column()
    submittedBy: string;

    @Column({ nullable: true })
    reviewedBy: string;

    @Column({ type: 'text', nullable: true })
    reviewNotes: string;

    @Column({ nullable: true })
    taskId: string;

    @Column({ type: 'boolean', default: false, name: 'submittedtoadmin' })
    submittedToAdmin: boolean;

    @Column({ type: 'text', nullable: true, name: 'submission_notes' })
    submissionNotes: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
