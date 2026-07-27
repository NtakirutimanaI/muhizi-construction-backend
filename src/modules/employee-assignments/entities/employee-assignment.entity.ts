import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { Project } from '../../projects/entities/project.entity';
import { Site } from '../../sites/entities/site.entity';

export enum AssignmentRole {
    STOREKEEPER = 'storekeeper',
    WORKER = 'worker',
    SUPERVISOR = 'supervisor',
}

@Entity('employee_assignments')
export class EmployeeAssignment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index('idx_assignment_employee')
    employeeId: string;

    @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'employeeId' })
    employee: Employee;

    @Column()
    @Index('idx_assignment_project')
    projectId: string;

    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @Column({ nullable: true })
    @Index('idx_assignment_site')
    siteId: string;

    @ManyToOne(() => Site, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'siteId' })
    site: Site;

    @Column({ nullable: true })
    task: string;

    @Column({ type: 'enum', enum: AssignmentRole, default: AssignmentRole.WORKER })
    role: AssignmentRole;

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date', nullable: true })
    endDate: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
