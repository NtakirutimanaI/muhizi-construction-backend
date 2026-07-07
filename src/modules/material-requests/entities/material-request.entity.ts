import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('material_requests')
export class MaterialRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    project: string;

    @Column()
    material: string;

    @Column({ default: 'pieces' })
    unit: string;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    unitPrice: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    totalCost: number;

    @Column({ default: 'pending' })
    status: string;

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ nullable: true })
    createdById: string;

    @Column({ nullable: true })
    createdByName: string;

    @Column({ nullable: true })
    approvedById: string;

    @Column({ nullable: true })
    approvedByName: string;

    @Column({ type: 'timestamp', nullable: true })
    approvedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
