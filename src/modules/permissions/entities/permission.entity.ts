import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, Unique } from 'typeorm';

@Entity('permissions')
@Unique(['role', 'resource', 'action'])
export class Permission {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index('idx_perm_role')
    role: string;

    @Column()
    @Index('idx_perm_resource')
    resource: string;

    @Column()
    action: string;

    @Column({ default: false })
    allowed: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    conditions: string;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
