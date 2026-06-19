import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../modules/auth/entities/user.entity';
import { Profile } from '../modules/profile/entities/profile.entity';

@Injectable()
export class DatabaseSeeder {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  async seedCompanyProfile() {
    this.logger.log('Starting to seed MUHIZI CONSTRUCTION company profile...');

    try {
      // Check if user already exists
      const existingUser = await this.userRepository.findOne({
        where: { email: 'info@muhiziconstruction.rw' },
      });

      if (existingUser) {
        this.logger.log('Profile already exists. Updating...');

        // Update existing profile
        const profile = await this.profileRepository.findOne({
          where: { user: { id: existingUser.id } },
        });

        if (profile) {
          Object.assign(profile, this.getProfileData());
          await this.profileRepository.save(profile);
          this.logger.log('✓ Profile updated successfully!');
          return profile;
        }
      }

      // Create new user
      const hashedPassword = await bcrypt.hash('Muhizi@2024', 10);

      const user = this.userRepository.create({
        email: 'info@muhiziconstruction.rw',
        username: 'muhizi_construction',
        password: hashedPassword,
        isActive: true,
      });

      await this.userRepository.save(user);
      this.logger.log('✓ User created');

      // Create profile with full details
      const profile = this.profileRepository.create({
        ...this.getProfileData(),
        user: user,
      });

      await this.profileRepository.save(profile);
      this.logger.log('✓ Profile created successfully!');
      this.logger.log('═══════════════════════════════════════');
      this.logger.log('Email: info@muhiziconstruction.rw');
      this.logger.log('Password: Muhizi@2024');
      this.logger.log('═══════════════════════════════════════');

      return profile;
    } catch (error) {
      this.logger.error(`Failed to seed profile: ${error.message}`);
      throw error;
    }
  }

  private getProfileData() {
    return {
      firstName: 'MUHIZI',
      lastName: 'CONSTRUCTION',
      email: 'info@muhiziconstruction.rw',
      phone: '+250 788 000 000',
      avatar: undefined,
      title: 'Real Estate & Construction Company',
      yearsOfExperience: 6,

      bio: `MUHIZI CONSTRUCTION is a leading construction and real estate company in Rwanda specializing in residential and commercial building construction, road infrastructure, and property development. 
With 6 years of experience delivering quality construction projects, we help bring architectural visions to life with precision and excellence.
Our team specializes in modern construction techniques, project management, and sustainable building practices.`,

      education: [
        {
          degree: 'Civil Engineering & Construction',
          institution: 'School of Engineering & Technology',
          graduationYear: 2020,
          description: 'Comprehensive training in structural design, construction materials, and project management for residential and commercial buildings.',
        },
        {
          degree: 'Real Estate Development',
          institution: 'Property Development Institute',
          graduationYear: 2021,
          description: 'Expertise in property valuation, land acquisition, real estate marketing, and property management for sustainable development.',
        },
        {
          degree: 'Infrastructure & Road Construction',
          institution: 'Institute of Infrastructure',
          graduationYear: 2022,
          description: 'Advanced knowledge of road construction, drainage systems, surveying, and large-scale infrastructure project management.',
        },
        {
          degree: 'Architectural Design & Planning',
          institution: 'School of Architecture & Design',
          graduationYear: 2023,
          description: 'Modern architectural design, 3D modeling, sustainable building design, and urban planning for contemporary spaces.',
        },
      ],

      about: `MUHIZI CONSTRUCTION is a leading construction and real estate company in Rwanda specializing in building construction, road infrastructure, and property development. With 6 years of experience, we deliver high-quality construction projects using modern techniques, skilled craftsmanship, and rigorous quality standards. Our team is committed to excellence, safety, and client satisfaction in every project we undertake.`,

      experience: [
        {
          title: 'Real Estate & Construction Company',
          company: 'MUHIZI CONSTRUCTION',
          location: 'Rwanda',
          startDate: '2020',
          current: true,
          description:
            'Leading construction and real estate company delivering quality residential and commercial buildings, road infrastructure, and property development projects across Rwanda.',
          technologies: [
            'Project Management',
            'Structural Engineering',
            'Architectural Design',
            'Construction Management',
            'Quality Control',
            'Safety Compliance',
            'Budget Planning',
            'Site Supervision',
          ],
        },
        {
          title: 'Building & Infrastructure Development',
          company: 'MUHIZI CONSTRUCTION',
          location: 'Rwanda',
          startDate: '2018',
          endDate: '2020',
          description:
            'Delivered multiple building construction and infrastructure projects, building expertise in modern construction techniques and project management.',
          technologies: [
            'Site Surveying',
            'Foundation Works',
            'Structural Framing',
            'Masonry',
            'Plumbing',
            'Electrical',
          ],
        },
      ],

      skills: {
        construction: [
          'Building Construction',
          'Road Construction',
          'Structural Engineering',
          'Foundation Works',
          'Masonry & Concrete',
          'Steel Structure',
          'Finishing Works',
          'Site Supervision',
        ],
        design: [
          'Architectural Design',
          '3D Modeling',
          'Structural Design',
          'Interior Design',
          'Landscaping',
          'Urban Planning',
          'Drafting',
          'Blueprints',
        ],
        management: [
          'Project Management',
          'Construction Management',
          'Quality Control',
          'Safety Compliance',
          'Budget Estimation',
          'Procurement',
          'Supply Chain',
          'Team Leadership',
        ],
        realEstate: [
          'Property Development',
          'Land Acquisition',
          'Property Valuation',
          'Real Estate Marketing',
          'Property Management',
          'Client Relations',
          'Contract Negotiation',
          'Legal Compliance',
        ],
        other: [
          'Sustainable Building',
          'Green Construction',
          'Risk Assessment',
          'Permit & Regulation',
          'Occupational Safety',
          'Environmental Compliance',
        ],
      },

      projects: [
        {
          name: 'Luxury Residential Estate',
          description:
            'Development of a modern luxury residential estate with 20 premium villas featuring contemporary architecture, landscaped gardens, and smart home technology.',
          technologies: ['Architecture', 'Civil Engineering', 'Interior Design', 'Landscaping'],
          imageUrl:
            'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000',
          featured: true,
          published: true,
          category: 'Fullstack' as 'Fullstack',
          effectiveness: 90,
          type: 'Completed Project',
          role: 'Lead Contractor',
        },
        {
          name: 'Commercial Office Complex',
          description:
            'Construction of a 5-story modern office complex with retail spaces, underground parking, and energy-efficient systems in the central business district.',
          technologies: ['Steel Structure', 'Glass Facade', 'HVAC', 'Smart Systems'],
          imageUrl:
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
          featured: true,
          published: true,
          category: 'Fullstack' as 'Fullstack',
          effectiveness: 85,
          type: 'Completed Project',
          role: 'General Contractor',
        },
        {
          name: 'Road Infrastructure Project',
          description:
            'Design and construction of 15km of urban road network including drainage systems, street lighting, sidewalks, and traffic management infrastructure.',
          technologies: ['Asphalt', 'Concrete', 'Drainage', 'Surveying'],
          imageUrl:
            'https://images.unsplash.com/photo-1541888946425-d81bbd406909?auto=format&fit=crop&q=80&w=1000',
          featured: true,
          published: true,
          category: 'Fullstack' as 'Fullstack',
          effectiveness: 88,
          type: 'Infrastructure Project',
          role: 'Project Manager',
        },
        {
          name: 'Affordable Housing Development',
          description:
            'Large-scale affordable housing project with 200 modern homes, community facilities, parks, and sustainable infrastructure for growing communities.',
          technologies: ['Mass Construction', 'Prefabrication', 'Green Building', 'Community Planning'],
          imageUrl:
            'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1000',
          featured: true,
          published: true,
          category: 'Fullstack' as 'Fullstack',
          effectiveness: 92,
          type: 'Completed Project',
          role: 'Lead Developer',
        },
      ],

      languages: [
        {
          language: 'English',
          proficiency: 'Business',
        },
        {
          language: 'Kinyarwanda',
          proficiency: 'Native',
        },
      ],

      socialLinks: {
        website: 'https://muhiziconstruction.rw',
      },

      city: 'Kigali',
      country: 'Rwanda',

      servicesOffered: `MUHIZI CONSTRUCTION offers professional construction and real estate services including:

• Residential Building Construction
• Commercial Building Construction
• Road & Infrastructure Construction
• Real Estate Development
• Property Management
• Architectural Design & Planning
• Interior & Exterior Finishing
• Renovation & Remodeling
• Land Surveying & Site Preparation
• Project Management & Consulting

Contact us to discuss your next project.`,

      availableForHire: true,
      isPublic: true,
    };
  }
}
