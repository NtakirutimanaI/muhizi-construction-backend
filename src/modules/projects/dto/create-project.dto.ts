import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectType, ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
    @ApiProperty({ example: 'Kigali Heights Tower', description: 'Project name' })
    @IsString({ message: 'name must be a string' })
    @IsNotEmpty({ message: 'name is required' })
    name: string;

    @ApiProperty({ example: 'Construction of a 10-story commercial building', required: false, description: 'Project description' })
    @IsString({ message: 'description must be a string' })
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'construction', required: false, description: 'Project type', enum: ProjectType })
    @IsEnum(ProjectType, { message: 'type must be a valid project type' })
    @IsOptional()
    type?: ProjectType;

    @ApiProperty({ example: 'planning', required: false, description: 'Project status', enum: ProjectStatus })
    @IsEnum(ProjectStatus, { message: 'status must be a valid project status' })
    @IsOptional()
    status?: ProjectStatus;

    @ApiProperty({ example: '2024-01-15', required: false, description: 'Project start date' })
    @IsDateString({}, { message: 'startDate must be a valid date string' })
    @IsOptional()
    startDate?: string;

    @ApiProperty({ example: '2025-06-30', required: false, description: 'Project end date' })
    @IsDateString({}, { message: 'endDate must be a valid date string' })
    @IsOptional()
    endDate?: string;

    @ApiProperty({ example: 500000000, required: false, description: 'Project budget' })
    @IsNumber({}, { message: 'budget must be a number' })
    @IsOptional()
    budget?: number;

    @ApiProperty({ example: 120000000, required: false, description: 'Amount spent so far' })
    @IsNumber({}, { message: 'spent must be a number' })
    @IsOptional()
    spent?: number;

    @ApiProperty({ example: 'KG 123 St, Kigali', required: false, description: 'Project location' })
    @IsString({ message: 'location must be a string' })
    @IsOptional()
    location?: string;

    @ApiProperty({ example: 'Alice Mukamana', required: false, description: 'Client name' })
    @IsString({ message: 'clientName must be a string' })
    @IsOptional()
    clientName?: string;

    @ApiProperty({ example: '+250-788-000-003', required: false, description: 'Client contact information' })
    @IsString({ message: 'clientContact must be a string' })
    @IsOptional()
    clientContact?: string;

    @ApiProperty({ example: 35, required: false, description: 'Project progress percentage (0-100)' })
    @IsNumber({}, { message: 'progress must be a number' })
    @Min(0, { message: 'progress must be between 0 and 100' })
    @Max(100, { message: 'progress must be between 0 and 100' })
    @IsOptional()
    progress?: number;

    @ApiProperty({ example: ['https://example.com/image1.jpg'], required: false, description: 'Project images' })
    @IsArray({ message: 'images must be an array' })
    @IsOptional()
    images?: string[];

    @ApiProperty({ example: [{ name: 'Contract', url: 'https://example.com/contract.pdf' }], required: false, description: 'Project documents' })
    @IsArray({ message: 'documents must be an array' })
    @IsOptional()
    documents?: { name: string; url: string }[];

    @ApiProperty({ example: [{ title: 'Foundation', date: '2024-03-01', completed: true }], required: false, description: 'Project milestones' })
    @IsArray({ message: 'milestones must be an array' })
    @IsOptional()
    milestones?: { title: string; date: string; completed: boolean }[];
}
