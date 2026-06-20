import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

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

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: IncomeCategory, default: IncomeCategory.OTHER })
    @Index('idx_income_category')
    category: IncomeCategory;

    @Column({ nullable: true })
    source: string;

    @Column({ nullable: true })
    projectId: string;

    @Column({ type: 'date' })
    @Index('idx_income_date')
    date: string;

    @Column({ nullable: true })
    paymentMethod: string;

    @Column({ nullable: true })
    reference: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
