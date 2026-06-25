import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum ProjectStatus {
    PLANNING = 'planning',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled',
}

export enum ProjectType {
    CONSTRUCTION = 'construction',
    RENOVATION = 'renovation',
    DESIGN = 'design',
}

@Entity('construction_projects')
export class Project {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 50, default: ProjectType.CONSTRUCTION })
    type: string;

    @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.PLANNING })
    @Index('idx_project_status')
    status: ProjectStatus;

    @Column({ type: 'date', nullable: true })
    startDate: string;

    @Column({ type: 'date', nullable: true })
    endDate: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    budget: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    spent: number;

    @Column({ nullable: true })
    location: string;

    @Column({ nullable: true })
    clientName: string;

    @Column({ nullable: true })
    clientContact: string;

    @Column({ type: 'int', default: 0 })
    progress: number;

    @Column({ type: 'json', nullable: true })
    images: string[];

    @Column({ type: 'json', nullable: true })
    documents: { name: string; url: string }[];

    @Column({ type: 'json', nullable: true })
    milestones: { title: string; date: string; completed: boolean }[];

    @CreateDateColumn()
    @Index('idx_project_created')
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
