import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('daily_reports')
export class DailyReport {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'date' })
    @Index('idx_daily_reports_date')
    date: string;

    @Column({ type: 'text' })
    summary: string;

    @Column()
    @Index('idx_daily_reports_submitted_by')
    submittedById: string;

    @Column()
    submittedByName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
