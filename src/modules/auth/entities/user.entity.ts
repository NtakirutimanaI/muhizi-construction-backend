import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Profile } from '../../profile/entities/profile.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    @Index('idx_users_email')
    email: string;

    @Column({ unique: true })
    @Index('idx_users_username')
    username: string;

    @Column()
    @Exclude()
    password: string;

    @Column({ default: true })
    @Index('idx_users_is_active')
    isActive: boolean;

    @Column({ type: 'varchar', default: 'admin' })
    @Index('idx_users_role')
    role: string;

    @Column({ nullable: true })
    @Exclude()
    refreshToken: string;

    @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
    profile: Profile;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
