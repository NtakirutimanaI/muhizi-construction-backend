import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('project_evidence')
export class ProjectEvidence {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    project: string;

    @Column()
    type: string;

    @Column()
    title: string;

    @Column()
    url: string;

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
