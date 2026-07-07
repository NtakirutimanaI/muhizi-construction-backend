import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

export enum ExpenseCategory {
    MATERIALS = 'materials',
    LABOR = 'labor',
    EQUIPMENT = 'equipment',
    TRANSPORT = 'transport',
    UTILITIES = 'utilities',
    RENT = 'rent',
    SALARY = 'salary',
    MARKETING = 'marketing',
    OTHER = 'other',
}

@Entity('expenses')
export class Expense {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @Column({ type: 'enum', enum: ExpenseCategory, default: ExpenseCategory.OTHER })
    @Index('idx_expense_category')
    category: ExpenseCategory;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ nullable: true })
    vendor: string;

    @Column({ nullable: true })
    paymentMethod: string;

    @Column({ type: 'date' })
    @Index('idx_expense_date')
    date: string;

    @Column({ nullable: true })
    receipt: string;

    @Column({ nullable: true })
    @Index('idx_expense_project')
    projectId: string;

    @ManyToOne(() => Project, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
