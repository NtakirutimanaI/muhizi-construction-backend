import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('file_uploads')
export class FileUpload {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index('idx_file_public_id')
    publicId: string;

    @Column()
    originalFilename: string;

    @Column()
    url: string;

    @Column()
    secureUrl: string;

    @Column({ default: 'image' })
    @Index('idx_file_resource_type')
    resourceType: string;

    @Column({ nullable: true })
    format: string;

    @Column({ type: 'int', nullable: true })
    bytes: number;

    @Column({ nullable: true })
    width: number;

    @Column({ nullable: true })
    height: number;

    @CreateDateColumn()
    @Index('idx_file_created')
    createdAt: Date;
}
