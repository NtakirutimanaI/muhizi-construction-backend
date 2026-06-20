import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    Index,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity('profiles')
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index('idx_profiles_first_name')
    firstName: string;

    @Column()
    @Index('idx_profiles_last_name')
    lastName: string;

    @Column({ type: 'text', nullable: true, name: 'avatar_content' })
    avatar: string;

    @Column({ type: 'text', nullable: true })
    cvUrl: string;

    @Column({ type: 'text', nullable: true })
    bio: string;

    @Column({ nullable: true, default: 'Hello' })
    greeting: string;

    @Column({ nullable: true, default: 'A Bit About Me' })
    aboutMeTitle: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    @Index('idx_profiles_email')
    email: string;

    @Column({ nullable: true })
    dateOfBirth: Date;

    @Column({ nullable: true })
    address: string;

    @Column({ nullable: true })
    city: string;

    @Column({ nullable: true })
    country: string;

    @Column({ nullable: true })
    zipCode: string;

    // Professional Information
    @Column({ nullable: true })
    title: string; // e.g., "Full Stack Developer"

    @Column({ nullable: true })
    type: string; // e.g., "Freelancer", "Employee", "Consultant"

    @Column({ nullable: true })
    role: string; // e.g., "Backend Developer", "Full Stack Engineer"

    @Column({ type: 'int', nullable: true })
    yearsOfExperience: number;

    @Column({ type: 'json', nullable: true })
    education: Array<{
        degree: string;
        institution: string;
        field?: string;
        graduationYear?: number;
        location?: string;
        description?: string;
    }>;

    @Column({ type: 'text', nullable: true })
    about: string;

    @Column({ type: 'json', nullable: true })
    experience: Array<{
        title: string;
        company: string;
        location?: string;
        startDate: string;
        endDate?: string;
        current?: boolean;
        description?: string;
        technologies?: string[];
    }>;

    @Column({ type: 'json', nullable: true })
    skills: {
        backend?: string[];
        frontend?: string[];
        databases?: string[];
        tools?: string[];
        other?: string[];
    };

    @Column({ type: 'json', nullable: true })
    projects: Array<{
        name: string;
        description: string;
        technologies: string[];
        url?: string;
        githubUrl?: string;
        imageUrl?: string;
        featured?: boolean;
        category?: 'Backend' | 'Frontend' | 'UI/UX' | 'Fullstack' | 'Other';
        effectiveness?: number; // 0-100
        published?: boolean;
        type?: string; // e.g., "Client Project", "Personal", "Open Source"
        role?: string; // e.g., "Lead Developer", "Solo Developer"
    }>;

    @Column({ type: 'json', nullable: true })
    certifications: Array<{
        name: string;
        issuer: string;
        date: string;
        url?: string;
    }>;

    @Column({ type: 'json', nullable: true })
    languages: Array<{
        language: string;
        proficiency: string; // e.g., "Native", "Fluent", "Intermediate"
    }>;

    @Column({ type: 'json', nullable: true })
    teamMembers: Array<{
        name: string;
        role: string;
        imageUrl?: string;
    }>;

    @Column({ type: 'json', nullable: true })
    socialLinks: {
        twitter?: string;
        linkedin?: string;
        github?: string;
        website?: string;
        portfolio?: string;
        stackoverflow?: string;
    };

    @Column({ type: 'text', nullable: true })
    servicesOffered: string;

    @Column({ default: true })
    availableForHire: boolean;

    @Column({ default: true })
    @Index('idx_profiles_is_public')
    isPublic: boolean;

    @Column({ default: true })
    allowMessages: boolean;

    @Column({ default: true })
    showViews: boolean;

    @Column({ default: false })
    @Index('idx_profiles_maintenance')
    maintenanceMode: boolean;

    @Column({ type: 'json', nullable: true })
    preferences: {
        enableAnimations?: boolean;
        enableNotifications?: boolean;
    };

    @Column({ nullable: true })
    poweredBy: string;

    @Column({ type: 'json', nullable: true })
    pageContent: {
        heroSlides?: Array<{
            title: string;
            body: string;
            color: string;
        }>;
        heroVideoUrl?: string;
        services?: {
            heading?: string;
            subtitle?: string;
            items?: Array<{
                title: string;
                description: string;
                tags: string[];
                color: string;
            }>;
        };
        events?: Array<{
            title: string;
            date: string;
            location: string;
            description: string;
        }>;
        aboutStats?: Array<{
            value: number;
            suffix: string;
            label: string;
        }>;
        mission?: { title: string; text: string; icon: string };
        vision?: { title: string; text: string; icon: string };
        philosophy?: { title: string; text: string; icon: string };
        coreValues?: Array<{
            title: string;
            text: string;
            icon: string;
        }>;
        whyChooseUs?: Array<{
            title: string;
            text: string;
            icon: string;
        }>;
        cta?: {
            title: string;
            subtitle: string;
            buttonText: string;
            buttonLink: string;
            secondaryButtonText: string;
            secondaryButtonLink: string;
        };
        followUs?: {
            heading?: string;
            subtitle?: string;
            youtubeUrl?: string;
            videos?: Array<{
                url: string;
                title: string;
                description?: string;
            }>;
        };
        faq?: {
            heading?: string;
            items?: Array<{
                question: string;
                answer: string;
            }>;
        };
        contactSection?: {
            heading?: string;
            subtitle?: string;
        };
        footer?: {
            companyDescription?: string;
            copyrightText?: string;
            quickLinks?: Array<{ label: string; url: string }>;
            showSocialLinks?: boolean;
            showContactInfo?: boolean;
        };
    };

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn()
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
