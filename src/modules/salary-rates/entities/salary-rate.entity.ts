import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('salary_rates')
export class SalaryRate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    role: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    baseSalary: number;

    @Column({ default: 'contracted' })
    contractType: string;

    @Column({ type: 'date' })
    effectiveFrom: string;

    @Column({ type: 'date', nullable: true })
    effectiveTo: string;

    @Column({ nullable: true })
    employeeId: string;

    @ManyToOne(() => Employee, { onDelete: 'CASCADE', nullable: true })
    @JoinColumn({ name: 'employeeId' })
    employee: Employee;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
