import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, Index } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { SiteRule } from '../../site-rules/entities/site-rule.entity';
import { SiteActivity } from '../../site-activities/entities/site-activity.entity';
import { ProjectEvidence } from '../../project-evidence/entities/project-evidence.entity';

export enum SiteStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    COMPLETED = 'completed',
}

@Entity('sites')
export class Site {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    location: string;

    @Column({ type: 'enum', enum: SiteStatus, default: SiteStatus.ACTIVE })
    @Index('idx_site_status')
    status: SiteStatus;

    @Column({ type: 'date', nullable: true })
    startDate: string;

    @Column({ type: 'date', nullable: true })
    endDate: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    budget: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    spent: number;

    @Column({ type: 'int', default: 0 })
    progress: number;

    @Column({ type: 'json', nullable: true })
    images: string[];

    @Column({ nullable: true })
    @Index('idx_site_project')
    projectId?: string;

    @ManyToOne(() => Project, (project) => project.sites, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @Column({ nullable: true })
    @Index('idx_site_assigned_engineer')
    assignedEngineerId?: string;

    @Column({ nullable: true })
    assignedEngineerName?: string;

    @OneToMany(() => SiteRule, (rule) => rule.site, { cascade: true })
    rules: SiteRule[];

    @OneToMany(() => SiteActivity, (activity) => activity.site, { cascade: true })
    activities: SiteActivity[];

    @OneToMany(() => ProjectEvidence, (evidence) => evidence.site, { cascade: true })
    evidence: ProjectEvidence[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
