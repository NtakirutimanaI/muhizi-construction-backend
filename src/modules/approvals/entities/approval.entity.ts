import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('approvals')
export class Approval {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    type: string;

    @Column()
    requester: string;

    @Column({ nullable: true })
    requesterId: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ default: 'pending' })
    status: string;

    @Column({ type: 'date' })
    requestedAt: string;

    @Column({ type: 'int', nullable: true })
    amount: number;

    @Column({ type: 'json', nullable: true })
    items: { name: string; qty: number; unit: string }[];

    @Column({ type: 'date', nullable: true })
    reviewedAt: string;

    @Column({ nullable: true })
    reviewedById: string;

    @Column({ nullable: true })
    reviewedByName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
