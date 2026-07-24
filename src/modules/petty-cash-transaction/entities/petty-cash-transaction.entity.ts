import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum TransactionType {
    CASH_ISSUED = 'cash_issued',
    CASH_RETURNED = 'cash_returned',
    FUND_REPLENISHMENT = 'fund_replenishment',
    ADJUSTMENT = 'adjustment',
    CORRECTION = 'correction',
    VOUCHER_PAYMENT = 'voucher_payment',
    VOUCHER_RECEIPT = 'voucher_receipt',
}

@Entity('petty_cash_transactions')
export class PettyCashTransaction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    fundId: string;

    @Column({ nullable: true })
    fundCode: string;

    @Column({ nullable: true })
    voucherId: string;

    @Column({ nullable: true })
    voucherNumber: string;

    @Column({ type: 'enum', enum: TransactionType })
    transactionType: TransactionType;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    balanceBefore: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    balanceAfter: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    reference: string;

    @Column({ nullable: true })
    performedById: string;

    @Column({ nullable: true })
    performedByName: string;

    @CreateDateColumn()
    createdAt: Date;
}
