import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('stock')
export class Stock {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    item: string;

    @Column({ type: 'varchar', length: 100, default: 'other' })
    @Index('idx_stock_category')
    category: string;

    @Column({ type: 'varchar', length: 10 })
    @Index('idx_stock_type')
    type: 'in' | 'out';

    @Column({ default: 'pieces' })
    unit: string;

    @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
    quantity: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    unitPrice: number;

    @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
    totalCost: number;

    @Column({ type: 'date' })
    date: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    time: string;

    @Column({ nullable: true })
    reference: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ nullable: true })
    @Index('idx_stock_created_by')
    createdById: string;

    @Column({ nullable: true })
    createdByName: string;

    @ManyToOne(() => User, { onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'createdById' })
    createdBy: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
