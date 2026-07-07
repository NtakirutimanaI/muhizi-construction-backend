import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Design } from '../../designs/entities/design.entity';
import { User } from '../../auth/entities/user.entity';

@Entity('design_reviews')
export class DesignReview {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    status: string;

    @Column({ type: 'text', nullable: true })
    comments: string;

    @Column({ type: 'timestamp', default: () => 'now()' })
    submittedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    reviewedAt: Date;

    @Column()
    designId: string;

    @ManyToOne(() => Design, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'designId' })
    design: Design;

    @Column()
    reviewerId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'reviewerId' })
    reviewer: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
