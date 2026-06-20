import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('site_rules')
export class SiteRule {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ nullable: true })
    iconName: string;

    @Column({ nullable: true })
    pinColor: string;

    @Column('simple-array')
    items: string[];

    @Column({ type: 'int', default: 0 })
    order: number;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
