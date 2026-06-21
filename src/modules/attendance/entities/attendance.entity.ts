import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';
import { Project } from '../../projects/entities/project.entity';

export enum AttendanceStatus {
    PRESENT = 'present',
    ABSENT = 'absent',
    LATE = 'late',
    HALF_DAY = 'half_day',
    ON_LEAVE = 'on_leave',
    PERMISSION = 'permission',
    SUSPENDED = 'suspended',
}

@Entity('attendance')
export class Attendance {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index('idx_attendance_employee')
    employeeId: string;

    @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'employeeId' })
    employee: Employee;

    @Column({ nullable: true })
    projectId: string;

    @ManyToOne(() => Project, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @Column({ nullable: true })
    site: string;

    @Column({ type: 'date' })
    @Index('idx_attendance_date')
    date: string;

    @Column({ type: 'time', nullable: true })
    checkIn: string;

    @Column({ type: 'time', nullable: true })
    checkOut: string;

    @Column({ type: 'enum', enum: AttendanceStatus, default: AttendanceStatus.PRESENT })
    @Index('idx_attendance_status')
    status: AttendanceStatus;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;
}
