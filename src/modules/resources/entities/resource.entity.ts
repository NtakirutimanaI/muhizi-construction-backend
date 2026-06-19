import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('resources')
export class Resource {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    type: 'credential' | 'link' | 'note' | 'event';

    @Column()
    title: string;

    @Column({ type: 'text', nullable: true })
    content: string; // The main value (Password, URL, Note text)

    @Column({ type: 'json', nullable: true })
    metadata: any; // Extra info: Username, Website Name, Event Date, Color

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
