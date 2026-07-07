import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('visitors')
export class Visitor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    name: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    company: string;

    @Column({ nullable: true })
    @Index('idx_visitor_location')
    location: string;

    @Column({ nullable: true })
    ipAddress: string;

    @Column({ nullable: true })
    @Index('idx_visitor_page')
    page: string;

    @Column({ nullable: true })
    referrer: string;

    @Column({ nullable: true })
    userAgent: string;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, any>;

    @CreateDateColumn()
    @Index('idx_visitor_visited_at')
    visitedAt: Date;
}
