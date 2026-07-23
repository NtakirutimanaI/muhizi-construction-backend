import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed',
    REJECTED = 'rejected',
}

export enum TaskPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
}

@Entity('tasks')
export class Task {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'enum', enum: TaskPriority, default: TaskPriority.MEDIUM })
    @Index('idx_task_priority')
    priority: TaskPriority;

    @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
    @Index('idx_task_status')
    status: TaskStatus;

    @Column()
    assignedTo: string;

    @Column()
    assignedToName: string;

    @Column()
    assignedBy: string;

    @Column()
    assignedByName: string;

    @Column({ nullable: true })
    dueDate: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ type: 'text', nullable: true })
    completionNotes: string;

    @CreateDateColumn()
    @Index('idx_task_created')
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
