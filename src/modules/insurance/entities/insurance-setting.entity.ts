import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('insurance_settings')
export class InsuranceSetting {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    provider: string;

    @Column()
    label: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    employeeAmount: number;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    employerAmount: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
