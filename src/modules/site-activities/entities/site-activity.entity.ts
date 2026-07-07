import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Site } from '../../sites/entities/site.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity('site_activities')
export class SiteActivity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index('idx_activity_project')
    project: string;

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ default: 'planned' })
    status: string;

    @Column({ type: 'int', default: 0 })
    workers: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    @Index('idx_activity_site')
    siteId: string;

    @ManyToOne(() => Site, (site) => site.activities, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'siteId' })
    site: Site;

    @ManyToOne(() => Project, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'project' })
    projectRef: Project;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
