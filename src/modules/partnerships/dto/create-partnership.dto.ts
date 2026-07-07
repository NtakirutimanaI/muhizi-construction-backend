import { IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartnershipType, PartnershipStatus } from '../entities/partnership.entity';

export class CreatePartnershipDto {
    @ApiProperty({ example: 'Kigali Cement Ltd', description: 'Company name of the partner' })
    @IsString({ message: 'companyName must be a string' })
    @IsNotEmpty({ message: 'companyName is required' })
    companyName: string;

    @ApiProperty({ example: 'Jean Paul', required: false, description: 'Contact person name' })
    @IsString({ message: 'contactPerson must be a string' })
    @IsOptional()
    contactPerson?: string;

    @ApiProperty({ example: 'jean.paul@kigalicement.rw', required: false, description: 'Email address of the partner' })
    @IsEmail({}, { message: 'email must be a valid email address' })
    @IsOptional()
    email?: string;

    @ApiProperty({ example: '+250-788-000-002', required: false, description: 'Phone number of the partner' })
    @IsString({ message: 'phone must be a string' })
    @IsOptional()
    phone?: string;

    @ApiProperty({ example: 'supplier', description: 'Type of partnership', enum: PartnershipType })
    @IsEnum(PartnershipType, { message: 'partnershipType must be a valid partnership type' })
    partnershipType: PartnershipType;

    @ApiProperty({ example: 'pending', required: false, description: 'Partnership status', enum: PartnershipStatus })
    @IsEnum(PartnershipStatus, { message: 'status must be a valid partnership status' })
    @IsOptional()
    status?: PartnershipStatus;

    @ApiProperty({ example: 'https://example.com/agreement.pdf', required: false, description: 'Agreement file URL' })
    @IsString({ message: 'agreementFile must be a string' })
    @IsOptional()
    agreementFile?: string;

    @ApiProperty({ example: '2024-01-01', required: false, description: 'Partnership start date' })
    @IsDateString({}, { message: 'startDate must be a valid date string' })
    @IsOptional()
    startDate?: string;

    @ApiProperty({ example: '2025-12-31', required: false, description: 'Partnership end date' })
    @IsDateString({}, { message: 'endDate must be a valid date string' })
    @IsOptional()
    endDate?: string;

    @ApiProperty({ example: 'Renewable annually', required: false, description: 'Additional notes' })
    @IsString({ message: 'notes must be a string' })
    @IsOptional()
    notes?: string;
}
