import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray, IsDateString, Min, Max } from 'class-validator';
import { ProjectType, ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(ProjectType)
    @IsOptional()
    type?: ProjectType;

    @IsEnum(ProjectStatus)
    @IsOptional()
    status?: ProjectStatus;

    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;

    @IsNumber()
    @IsOptional()
    budget?: number;

    @IsNumber()
    @IsOptional()
    spent?: number;

    @IsString()
    @IsOptional()
    location?: string;

    @IsString()
    @IsOptional()
    clientName?: string;

    @IsString()
    @IsOptional()
    clientContact?: string;

    @IsNumber()
    @Min(0)
    @Max(100)
    @IsOptional()
    progress?: number;

    @IsArray()
    @IsOptional()
    images?: string[];

    @IsArray()
    @IsOptional()
    documents?: { name: string; url: string }[];

    @IsArray()
    @IsOptional()
    milestones?: { title: string; date: string; completed: boolean }[];
}
