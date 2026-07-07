import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('page_sections')
export class PageSection {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index('idx_ps_page')
    page: string;

    @Column()
    @Index('idx_ps_section')
    section: string;

    @Column({ type: 'text', nullable: true })
    title: string;

    @Column({ type: 'text', nullable: true })
    subtitle: string;

    @Column({ type: 'text', nullable: true })
    body: string;

    @Column({ default: 0 })
    order: number;

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'json', nullable: true })
    images: { url: string; alt: string; order: number }[];

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
