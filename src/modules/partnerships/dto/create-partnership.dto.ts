import { IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail, IsDateString, IsNumber } from 'class-validator';
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

    @ApiProperty({ example: 'KG 7 Ave, Kigali, Rwanda', required: false, description: 'Business address' })
    @IsString({ message: 'address must be a string' })
    @IsOptional()
    address?: string;

    @ApiProperty({ example: '123456789', required: false, description: 'Business registration number (e.g. RDB number)' })
    @IsString({ message: 'registrationNumber must be a string' })
    @IsOptional()
    registrationNumber?: string;

    @ApiProperty({ example: 'TIN-100234567', required: false, description: 'Tax Identification Number' })
    @IsString({ message: 'taxId must be a string' })
    @IsOptional()
    taxId?: string;

    @ApiProperty({ example: 'supplier', description: 'Type of partnership', enum: PartnershipType })
    @IsEnum(PartnershipType, { message: 'partnershipType must be a valid partnership type' })
    partnershipType: PartnershipType;

    @ApiProperty({ example: 'pending', required: false, description: 'Partnership status', enum: PartnershipStatus })
    @IsEnum(PartnershipStatus, { message: 'status must be a valid partnership status' })
    @IsOptional()
    status?: PartnershipStatus;

    @ApiProperty({ example: 'LIC-2026-0042', required: false, description: 'Trade/contractor license number (supplier/subcontractor)' })
    @IsString({ message: 'licenseNumber must be a string' })
    @IsOptional()
    licenseNumber?: string;

    @ApiProperty({ example: '2027-06-30', required: false, description: 'Trade/contractor license expiry date' })
    @IsDateString({}, { message: 'licenseExpiry must be a valid date string' })
    @IsOptional()
    licenseExpiry?: string;

    @ApiProperty({ example: '2027-06-30', required: false, description: 'Liability/workers\' comp insurance expiry date' })
    @IsDateString({}, { message: 'insuranceExpiry must be a valid date string' })
    @IsOptional()
    insuranceExpiry?: string;

    @ApiProperty({ example: 50000000, required: false, description: 'Capital committed (investor / joint_venture)' })
    @IsNumber({}, { message: 'investmentAmount must be a number' })
    @IsOptional()
    investmentAmount?: number;

    @ApiProperty({ example: 12.5, required: false, description: 'Ownership/equity share percentage (investor / joint_venture)' })
    @IsNumber({}, { message: 'equityPercentage must be a number' })
    @IsOptional()
    equityPercentage?: number;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', required: false, description: 'Project this partnership is tied to (mainly for joint ventures)' })
    @IsString({ message: 'projectId must be a string' })
    @IsOptional()
    projectId?: string;

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
