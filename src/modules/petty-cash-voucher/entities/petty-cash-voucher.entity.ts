import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum VoucherStatus {
    DRAFT = 'draft',
    PENDING = 'pending',
    APPROVED = 'approved',
    PAID = 'paid',
    CLOSED = 'closed',
    REJECTED = 'rejected',
}

@Entity('petty_cash_vouchers')
export class PettyCashVoucher {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    voucherNumber: string;

    @Column({ type: 'date' })
    date: string;

    @Column({ nullable: true })
    reference: string;

    @Column({ type: 'enum', enum: VoucherStatus, default: VoucherStatus.DRAFT })
    status: VoucherStatus;

    // Payee Information
    @Column()
    payeeName: string;

    @Column({ nullable: true })
    employeeId: string;

    @Column({ nullable: true })
    department: string;

    @Column({ nullable: true })
    position: string;

    @Column({ nullable: true })
    payeePhone: string;

    @Column({ nullable: true })
    payeeEmail: string;

    // Payment Details
    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ default: 'RWF' })
    currency: string;

    @Column()
    paymentPurpose: string;

    @Column({ nullable: true })
    paymentMethod: string;

    @Column({ type: 'date', nullable: true })
    paymentDate: string;

    @Column({ nullable: true })
    cashFundAccount: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    // Requested By
    @Column({ nullable: true })
    requestedByName: string;

    @Column({ nullable: true })
    requestedBySignature: string;

    @Column({ nullable: true })
    requestedDate: string;

    // Approved By
    @Column({ nullable: true })
    approvedByName: string;

    @Column({ nullable: true })
    approvedBySignature: string;

    @Column({ nullable: true })
    approvedDate: string;

    @Column({ nullable: true })
    rejectionReason: string;

    // Payment Confirmation
    @Column({ nullable: true })
    confirmedByName: string;

    @Column({ nullable: true })
    confirmedDate: string;

    @Column({ type: 'text', nullable: true })
    paymentConfirmationNotes: string;

    // Fund Link
    @Column({ nullable: true })
    fundId: string;

    @Column({ nullable: true })
    fundName: string;

    // Line Items
    @Column({ type: 'jsonb', nullable: true })
    lineItems: { id: string; description: string; expenseCategory: string; debit: number; credit: number; quantity: number; unitCost: number }[];

    @Column({ nullable: true })
    expenseCategory: string;

    // Checked By
    @Column({ nullable: true })
    checkedByName: string;

    @Column({ nullable: true })
    checkedBySignature: string;

    @Column({ nullable: true })
    checkedDate: string;

    // Paid By
    @Column({ nullable: true })
    paidByName: string;

    @Column({ nullable: true })
    paidBySignature: string;

    @Column({ nullable: true })
    paidDate: string;

    // Received By
    @Column({ nullable: true })
    receivedByName: string;

    @Column({ nullable: true })
    receivedBySignature: string;

    @Column({ nullable: true })
    receivedDate: string;

    // Supporting Documents
    @Column({ type: 'jsonb', nullable: true })
    supportingDocs: { id: string; name: string; type: string; url: string }[];

    @Column({ nullable: true })
    receiptUrl: string;

    // Notes & Transaction Type
    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ nullable: true })
    transactionType: string;

    // Transaction Lines (Dr/Cr ledger rows)
    @Column({ type: 'jsonb', nullable: true })
    transactions: { id: string; date: string; description: string; debit: number; credit: number }[];

    // Audit Trail
    @Column({ nullable: true })
    createdById: string;

    @Column({ nullable: true })
    createdByName: string;

    @Column({ nullable: true })
    lastModifiedById: string;

    @Column({ nullable: true })
    lastModifiedByName: string;

    @Column({ nullable: true })
    softwareVersion: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
