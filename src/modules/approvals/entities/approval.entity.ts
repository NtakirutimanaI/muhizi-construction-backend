import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('approvals')
export class Approval {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: string;

    @Column()
    title: string;

    @Column()
    requester: string;

    @Column({ type: 'int', nullable: true })
    amount: number;

    @Column({ type: 'json', nullable: true })
    items: { name: string; qty: number; unit: string }[];

    @Column({ type: 'text' })
    description: string;

    @Column({ default: 'pending' })
    status: string;

    @Column({ type: 'date' })
    requestedAt: string;

    @Column({ type: 'date', nullable: true })
    reviewedAt: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
