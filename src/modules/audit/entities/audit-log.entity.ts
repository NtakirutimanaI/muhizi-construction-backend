import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index('idx_audit_user_id')
    userId: string;

    @Column({ nullable: true })
    userEmail: string;

    @Column({ nullable: true })
    @Index('idx_audit_user_role')
    userRole: string;

    @Column()
    @Index('idx_audit_action')
    action: string;

    @Column({ nullable: true })
    @Index('idx_audit_entity')
    entity: string;

    @Column({ nullable: true })
    entityId: string;

    @Column({ nullable: true })
    ipAddress: string;

    @Column({ type: 'json', nullable: true })
    metadata: Record<string, any>;

    @CreateDateColumn()
    @Index('idx_audit_created')
    createdAt: Date;
}
