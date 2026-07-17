import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

export enum IncomeCategory {
    PROJECT_PAYMENT = 'project_payment',
    RENTAL = 'rental',
    INVESTMENT = 'investment',
    CONSULTING = 'consulting',
    OTHER = 'other',
}

@Entity('incomes')
export class Income {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @Column({ type: 'enum', enum: IncomeCategory, default: IncomeCategory.OTHER })
    @Index('idx_income_category')
    category: IncomeCategory;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    source: string;

    @Column({ nullable: true })
    paymentMethod: string;

    @Column({ type: 'date' })
    @Index('idx_income_date')
    date: string;

    @Column({ nullable: true })
    reference: string;

    @Column({ nullable: true })
    @Index('idx_income_project')
    projectId: string;

    @ManyToOne(() => Project, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @Column({ type: 'text', nullable: true })
    notes: string;

    /** What this income actually covered — e.g. materials/work delivered and their price,
     * so the record is self-explanatory on export rather than just a lump sum. */
    @Column({ type: 'json', nullable: true })
    items: { description: string; amount: number }[];

    /** Who recorded this income — the audit trail the finance reports read from. */
    @Column({ nullable: true })
    recordedById: string;

    @Column({ nullable: true })
    recordedByName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
