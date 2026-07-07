import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum EmployeeStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    TERMINATED = 'terminated',
}

export enum Department {
    ADMIN = 'admin',
    CONSTRUCTION = 'construction',
    DESIGN = 'design',
    FINANCE = 'finance',
    HR = 'hr',
    SALES = 'sales',
    ENGINEERING = 'engineering',
    OTHER = 'other',
}

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    @Index('idx_employee_email', { unique: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    maritalStatus: string;

    @Column({ nullable: true })
    nationalId: string;

    @Column({ nullable: true })
    educationLevel: string;

    @Column({ nullable: true })
    position: string;

    @Column({ type: 'enum', enum: Department, default: Department.OTHER })
    @Index('idx_employee_department')
    department: Department;

    @Column({ type: 'date', nullable: true })
    hireDate: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    salary: number;

    @Column({ type: 'enum', enum: EmployeeStatus, default: EmployeeStatus.ACTIVE })
    @Index('idx_employee_status')
    status: EmployeeStatus;

    @Column({ nullable: true })
    emergencyContact: string;

    @Column({ nullable: true })
    avatar: string;

    @Column({ type: 'json', nullable: true })
    documents: { name: string; url: string }[];

    @CreateDateColumn()
    @Index('idx_employee_created')
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
