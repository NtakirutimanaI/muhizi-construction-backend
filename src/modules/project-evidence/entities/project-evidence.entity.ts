import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Site } from '../../sites/entities/site.entity';

@Entity('project_evidence')
export class ProjectEvidence {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    project: string;

    @Column()
    title: string;

    @Column()
    type: string;

    @Column()
    url: string;

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ default: false })
    approvedForClient: boolean;

    @Column({ nullable: true })
    @Index('idx_evidence_site')
    siteId: string;

    @ManyToOne(() => Site, (site) => site.evidence, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'siteId' })
    site: Site;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
