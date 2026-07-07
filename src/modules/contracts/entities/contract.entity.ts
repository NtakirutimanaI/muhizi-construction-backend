import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('contracts')
export class Contract {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    employeeName: string;

    @Column()
    department: string;

    @Column()
    type: string;

    @Column({ default: 'active' })
    status: string;

    @Column({ type: 'date' })
    startDate: string;

    @Column({ type: 'date', nullable: true })
    endDate: string;

    @Column({ nullable: true })
    fileUrl: string;

    @Column({ nullable: true })
    fileSize: string;

    @Column({ type: 'text', nullable: true })
    body: string;

    @Column({ type: 'text', nullable: true })
    footer: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
