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

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ unique: true })
    @Index('idx_users_email')
    email: string;

    @Column()
    @Index('idx_users_username')
    username: string;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    maritalStatus: string;

    @Column({ nullable: true })
    nationalId: string;

    @Column({ nullable: true })
    educationLevel: string;

    @Column({ type: 'varchar', default: 'admin' })
    @Index('idx_users_role')
    role: string;

    @Column({ nullable: true, type: 'varchar' })
    @Exclude()
    password: string | null;

    @Column({ default: true })
    @Index('idx_users_is_active')
    isActive: boolean;

    @Column({ nullable: true, type: 'varchar' })
    @Exclude()
    refreshToken: string | null;

    @Column({ nullable: true, type: 'varchar' })
    @Exclude()
    otpCode: string | null;

    @Column({ nullable: true, type: 'timestamp' })
    otpExpiresAt: Date | null;

    @Column({ nullable: true, type: 'varchar' })
    googleId: string | null;

    @OneToOne(() => Profile, (profile) => profile.user, { cascade: true })
    profile: Profile;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
