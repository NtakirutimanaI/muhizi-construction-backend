import {
    IsString,
    IsOptional,
    IsDateString,
    IsObject,
    ValidateNested,
    IsArray,
    IsNumber,
    IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

class SocialLinksDto {
    @IsOptional()
    @IsString()
    twitter?: string;

    @IsOptional()
    @IsString()
    linkedin?: string;

    @IsOptional()
    @IsString()
    github?: string;

    @IsOptional()
    @IsString()
    website?: string;
}

export class UpdateProfileDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsString()
    avatar?: string;

    @IsOptional()
    @IsString()
    cvUrl?: string;

    @IsOptional()
    @IsString()
    bio?: string;

    @IsOptional()
    @IsString()
    greeting?: string;

    @IsOptional()
    @IsString()
    aboutMeTitle?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsDateString()
    dateOfBirth?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    city?: string;

    @IsOptional()
    @IsString()
    country?: string;

    @IsOptional()
    @IsString()
    zipCode?: string;

    // Professional fields
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    type?: string;

    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsNumber()
    yearsOfExperience?: number;

    @IsOptional()
    @IsBoolean()
    availableForHire?: boolean;

    @IsOptional()
    @IsString()
    servicesOffered?: string;

    @IsOptional()
    @IsArray()
    education?: any[];

    @IsOptional()
    @IsString()
    about?: string;

    @IsOptional()
    @IsArray()
    experience?: any[];

    @IsOptional()
    @IsObject()
    skills?: any;

    @IsOptional()
    @IsArray()
    projects?: any[];

    @IsOptional()
    @IsArray()
    certifications?: any[];

    @IsOptional()
    @IsArray()
    languages?: any[];

    @IsOptional()
    @IsArray()
    teamMembers?: any[];

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => SocialLinksDto)
    socialLinks?: SocialLinksDto;


    @IsOptional()
    @IsBoolean()
    isPublic?: boolean;

    @IsOptional()
    @IsString()
    poweredBy?: string;

    @IsOptional()
    @IsBoolean()
    allowMessages?: boolean;

    @IsOptional()
    @IsBoolean()
    showViews?: boolean;

    @IsOptional()
    @IsBoolean()
    maintenanceMode?: boolean;

    @IsOptional()
    @IsObject()
    preferences?: {
        enableAnimations?: boolean;
        enableNotifications?: boolean;
    };

    @IsOptional()
    @IsObject()
    pageContent?: object;
}

