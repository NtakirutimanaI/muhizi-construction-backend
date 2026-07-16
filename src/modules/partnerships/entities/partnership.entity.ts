import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

export enum PartnershipType {
    SUPPLIER = 'supplier',
    SUBCONTRACTOR = 'subcontractor',
    INVESTOR = 'investor',
    JOINT_VENTURE = 'joint_venture',
}

export enum PartnershipStatus {
    PENDING = 'pending',
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    REJECTED = 'rejected',
}

@Entity('partnerships')
export class Partnership {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    companyName: string;

    @Column({ nullable: true })
    contactPerson: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address: string;

    /** Business/company registration number (e.g. RDB number) — required for any legitimate procurement or investment relationship. */
    @Column({ nullable: true })
    registrationNumber: string;

    /** Tax Identification Number, required for invoicing and tax-compliant B2B dealings. */
    @Column({ nullable: true })
    taxId: string;

    @Column({ type: 'enum', enum: PartnershipType })
    @Index('idx_partnership_type')
    partnershipType: PartnershipType;

    @Column({ type: 'enum', enum: PartnershipStatus, default: PartnershipStatus.PENDING })
    @Index('idx_partnership_status')
    status: PartnershipStatus;

    /** Trade/contractor license — relevant for supplier and subcontractor vetting. */
    @Column({ nullable: true })
    licenseNumber: string;

    @Column({ type: 'date', nullable: true })
    licenseExpiry: string;

    /** Liability / workers' comp insurance expiry — the standard construction-industry risk control for subcontractors. */
    @Column({ type: 'date', nullable: true })
    insuranceExpiry: string;

    /** Capital committed, for investor and joint_venture partnerships. */
    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    investmentAmount: number;

    /** Ownership/equity share (%), for investor and joint_venture partnerships. */
    @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
    equityPercentage: number;

    @Column({ nullable: true })
    @Index('idx_partnership_project')
    projectId: string;

    @ManyToOne(() => Project, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @Column({ nullable: true })
    agreementFile: string;

    @Column({ type: 'date', nullable: true })
    startDate: string;

    @Column({ type: 'date', nullable: true })
    endDate: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    /** Set automatically from the authenticated reviewer when status moves out of "pending". */
    @Column({ nullable: true })
    reviewedById: string;

    @Column({ nullable: true })
    reviewedByName: string;

    @Column({ type: 'timestamp', nullable: true })
    reviewedAt: Date;

    @CreateDateColumn()
    @Index('idx_partnership_created')
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
