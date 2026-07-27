import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum PettyCashType {
    IN = 'in',
    OUT = 'out',
}

@Entity('petty_cash')
export class PettyCash {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 15, scale: 2 })
    amount: number;

    @Column({ type: 'enum', enum: PettyCashType })
    type: PettyCashType;

    @Column({ type: 'date' })
    date: string;

    @Column({ nullable: true })
    receivedFrom: string;

    @Column({ nullable: true })
    paidTo: string;

    @Column({ nullable: true })
    reference: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ nullable: true })
    recordedById: string;

    @Column({ nullable: true })
    recordedByName: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
