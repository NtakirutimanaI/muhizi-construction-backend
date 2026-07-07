import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm';

@Entity('resources')
export class Resource {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index('idx_resource_type')
    type: 'credential' | 'link' | 'note' | 'event';

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    content: string;

    @Column({ type: 'json', nullable: true })
    metadata: any;

    @CreateDateColumn()
    @Index('idx_resource_created')
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
