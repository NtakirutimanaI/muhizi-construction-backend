import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Stock } from '../../stock/entities/stock.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('stock_approvals')
export class StockApproval {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: 'pending' })
    status: string;

    @Column({ type: 'text', nullable: true })
    comments: string;

    @Column({ default: 'co_sign' })
    type: string;

    @Column()
    stockId: string;

    @ManyToOne(() => Stock, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'stockId' })
    stock: Stock;

    @Column()
    approvedById: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'approvedById' })
    approvedBy: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
