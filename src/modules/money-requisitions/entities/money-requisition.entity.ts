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

    @Column({ nullable: true })
    department: string;

    @Column({ nullable: true })
    reason: string;

    @Column({ type: 'date', nullable: true })
    requestedDisbursementDate: string;

    @Column({ nullable: true })
    requesterSignature: string;

    @Column({ nullable: true })
    authorizationStatus: string;

    @Column({ nullable: true })
    authorizedByName: string;

    @Column({ nullable: true })
    authorizedByPosition: string;

    @Column({ nullable: true })
    authorizedBySignature: string;

    @Column({ type: 'text', nullable: true })
    stampUrl: string;

    @Column({ type: 'date', nullable: true })
    authorizationDate: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
