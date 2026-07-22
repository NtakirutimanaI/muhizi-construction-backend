import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('updates')
export class Update {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index('idx_update_title')
    title: string;

    @Column({ unique: true })
    @Index('idx_update_slug')
    slug: string;

    @Column({ type: 'text', nullable: true })
    summary: string;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ nullable: true })
    image: string;

    @Column({ nullable: true })
    category: string;

    @Column({ nullable: true })
    author: string;

    @Column({ nullable: true })
    readTime: string;

    @Column({ type: 'int', default: 0 })
    comments: number;

    @Column({ type: 'boolean', default: false })
    @Index('idx_update_published')
    isPublished: boolean;

    @Column({ type: 'timestamp', nullable: true })
    publishedAt: Date;

    @CreateDateColumn()
    @Index('idx_update_created')
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
