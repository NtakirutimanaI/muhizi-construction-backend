import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('contracts')
export class Contract {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    @Index('idx_contract_employee')
    employeeId: string;

    @Column()
    employeeName: string;

    @Column()
    department: string;

    @Column()
    type: string;

    @Column({ default: 'active' })
    status: string;

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date', nullable: true })
    endDate: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    basicSalary: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    netSalary: number;

    @Column({ nullable: true })
    paymentFrequency: string;

    @Column({ type: 'text', nullable: true })
    workingConditions: string;

    @Column({ nullable: true })
    fileUrl: string;

    @Column({ nullable: true })
    fileSize: string;

    @Column({ type: 'text', nullable: true })
    body: string;

    @Column({ type: 'text', nullable: true })
    footer: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
