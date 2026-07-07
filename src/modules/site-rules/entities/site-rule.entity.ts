import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Site } from '../../sites/entities/site.entity';

@Entity('site_rules')
export class SiteRule {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    iconName: string;

    @Column({ nullable: true })
    pinColor: string;

    @Column('simple-array')
    items: string[];

    @Column({ type: 'int', default: 0 })
    order: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    @Index('idx_rule_site')
    siteId: string;

    @ManyToOne(() => Site, (site) => site.rules, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'siteId' })
    site: Site;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
