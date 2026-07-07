import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('subscribers')
export class Subscriber {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    source: string;

    @Column({ type: 'int', default: 50 })
    mlScore: number;

    @Column({ nullable: true })
    mlCategory: string;

    @CreateDateColumn()
    subscribedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
