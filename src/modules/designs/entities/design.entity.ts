import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

export enum DesignStatus {
    DRAFT = 'draft',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export enum DesignType {
    ARCHITECTURAL = 'architectural',
    STRUCTURAL = 'structural',
    INTERIOR = 'interior',
    LANDSCAPE = 'landscape',
}

export enum DesignSource {
    SUBMISSION = 'submission',
    EXTERNAL = 'external',
}

@Entity('designs')
export class Design {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'enum', enum: DesignType, default: DesignType.ARCHITECTURAL })
    @Index('idx_design_type')
    type: DesignType;

    @Column({ type: 'enum', enum: DesignStatus, default: DesignStatus.DRAFT })
    @Index('idx_design_status')
    status: DesignStatus;

    @Column({ type: 'enum', enum: DesignSource, default: DesignSource.EXTERNAL })
    @Index('idx_design_source')
    source: DesignSource;

    @Column({ nullable: true })
    fileUrl: string;

    @Column({ nullable: true })
    thumbnailUrl: string;

    @Column({ nullable: true })
    projectId: string;

    @ManyToOne(() => Project, { nullable: true, onDelete: 'SET NULL' })
    @JoinColumn({ name: 'projectId' })
    project: Project;

    @Column({ nullable: true, name: 'savedby' })
    @Index('idx_design_saved_by')
    savedBy: string;

    @Column({ type: 'json', nullable: true })
    metadata: {
        architect?: string;
        scale?: string;
        version?: string;
        dimensions?: string;
    };

    @CreateDateColumn()
    @Index('idx_design_created')
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
