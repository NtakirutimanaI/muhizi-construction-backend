import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum FundStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

@Entity('petty_cash_funds')
export class PettyCashFund {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    fundCode: string;

    @Column()
    fundName: string;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    openingBalance: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    currentBalance: number;

    @Column({ default: 'RWF' })
    currency: string;

    @Column()
    custodian: string;

    @Column({ nullable: true })
    custodianId: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'enum', enum: FundStatus, default: FundStatus.ACTIVE })
    status: FundStatus;

    // Audit Trail
    @Column({ nullable: true })
    createdById: string;

    @Column({ nullable: true })
    createdByName: string;

    @Column({ nullable: true })
    lastModifiedById: string;

    @Column({ nullable: true })
    lastModifiedByName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
