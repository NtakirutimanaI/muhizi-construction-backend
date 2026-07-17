import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('contracts')
export class Contract {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    @Index('idx_contract_employee')
    employeeId: string;

    @ManyToOne(() => Employee, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'employeeId' })
    employee: Employee;

    /** Denormalized snapshot of the employee's name at signing time — kept so the contract
     * still reads correctly if the employee record is later removed. */
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
