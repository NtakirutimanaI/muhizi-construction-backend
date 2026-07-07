import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray, IsDateString, Min, Max, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SiteStatus } from '../entities/site.entity';

export class CreateSiteDto {
    @ApiProperty({ example: 'Kigali Heights Tower', description: 'Name of the construction site' })
    @IsString({ message: 'Name must be a string' })
    @IsNotEmpty({ message: 'Name is required' })
    name: string;

    @ApiProperty({ example: 'A 20-story commercial building in Kigali', required: false, description: 'Detailed description of the site' })
    @IsString({ message: 'Description must be a string' })
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'Kigali, Rwanda', required: false, description: 'Physical location of the site' })
    @IsString({ message: 'Location must be a string' })
    @IsOptional()
    location?: string;

    @ApiProperty({ example: SiteStatus.ACTIVE, required: false, description: 'Current status of the site', enum: SiteStatus })
    @IsEnum(SiteStatus, { message: 'Status must be a valid SiteStatus value' })
    @IsOptional()
    status?: SiteStatus;

    @ApiProperty({ example: '2025-01-15', required: false, description: 'Projected or actual start date' })
    @IsDateString({}, { message: 'Start date must be a valid ISO 8601 date string' })
    @IsOptional()
    startDate?: string;

    @ApiProperty({ example: '2026-06-30', required: false, description: 'Projected or actual end date' })
    @IsDateString({}, { message: 'End date must be a valid ISO 8601 date string' })
    @IsOptional()
    endDate?: string;

    @ApiProperty({ example: 500000000, required: false, description: 'Total budget allocated in RWF' })
    @IsNumber({}, { message: 'Budget must be a number' })
    @IsOptional()
    budget?: number;

    @ApiProperty({ example: 250000000, required: false, description: 'Amount spent so far in RWF' })
    @IsNumber({}, { message: 'Spent must be a number' })
    @IsOptional()
    spent?: number;

    @ApiProperty({ example: 45, required: false, description: 'Completion percentage (0-100)' })
    @IsNumber({}, { message: 'Progress must be a number' })
    @Min(0, { message: 'Progress must be at least 0' })
    @Max(100, { message: 'Progress must not exceed 100' })
    @IsOptional()
    progress?: number;

    @ApiProperty({ example: ['https://example.com/image1.jpg'], required: false, description: 'Array of image URLs for the site' })
    @IsArray({ message: 'Images must be an array' })
    @IsOptional()
    images?: string[];

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', required: false, description: 'UUID of the associated project' })
    @IsUUID('4', { message: 'Project ID must be a valid UUID' })
    @IsOptional()
    projectId?: string;
}
