import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

export enum PayrollStatus {
    DRAFT = 'draft',
    PAID = 'paid',
    PENDING = 'pending',
}

@Entity('payroll_records')
export class Payroll {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index('idx_payroll_employee')
    employeeId: string;

    @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'employeeId' })
    employee: Employee;

    @Column({ type: 'int' })
    @Index('idx_payroll_period')
    month: number;

    @Column({ type: 'int' })
    year: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    basicSalary: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    totalAllowances: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    totalDeductions: number;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    netSalary: number;

    @Column({ type: 'json', nullable: true })
    allowances: { label: string; amount: number }[];

    @Column({ type: 'json', nullable: true })
    deductions: { label: string; amount: number }[];

    @Column({ type: 'enum', enum: PayrollStatus, default: PayrollStatus.DRAFT })
    @Index('idx_payroll_status')
    status: PayrollStatus;

    @Column({ type: 'date', nullable: true })
    paymentDate: string;

    @Column({ nullable: true })
    paymentMethod: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
