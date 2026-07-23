import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('money_requisitions')
export class MoneyRequisition {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ default: 'pending' })
    status: string;

    @Column({ type: 'date' })
    requestedAt: string;

    @Column({ nullable: true })
    requesterId: string;

    @Column({ nullable: true })
    requesterName: string;

    @Column({ nullable: true })
    reviewedById: string;

    @Column({ nullable: true })
    reviewedByName: string;

    @Column({ type: 'date', nullable: true })
    reviewedAt: string;

    @Column({ type: 'text', nullable: true })
    adminNotes: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
