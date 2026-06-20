import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('site_activities')
export class SiteActivity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
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

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
