import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

export enum PartnershipType {
    SUPPLIER = 'supplier',
    SUBCONTRACTOR = 'subcontractor',
    INVESTOR = 'investor',
    JOINT_VENTURE = 'joint_venture',
}

export enum PartnershipStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending',
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

    @Column({ type: 'enum', enum: PartnershipType })
    @Index('idx_partnership_type')
    partnershipType: PartnershipType;

    @Column({ type: 'enum', enum: PartnershipStatus, default: PartnershipStatus.PENDING })
    @Index('idx_partnership_status')
    status: PartnershipStatus;

    @Column({ nullable: true })
    agreementFile: string;

    @Column({ type: 'date', nullable: true })
    startDate: string;

    @Column({ type: 'date', nullable: true })
    endDate: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn()
    @Index('idx_partnership_created')
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
