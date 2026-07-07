import { IsString, IsOptional, IsNumber, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientReportDto {
    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'UUID of the project this report belongs to' })
    @IsUUID('4', { message: 'projectId must be a valid UUID' })
    projectId: string;

    @ApiProperty({ example: 'Monthly Progress Report - January', description: 'Report title' })
    @IsString({ message: 'title must be a string' })
    title: string;

    @ApiProperty({ example: 'This report covers the progress made during January...', description: 'Detailed report description', required: false })
    @IsOptional()
    @IsString({ message: 'description must be a string' })
    description?: string;

    @ApiProperty({ example: 75, description: 'Overall progress percentage', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'progressPercentage must be a number' })
    progressPercentage?: number;

    @ApiProperty({ example: 'in_progress', description: 'Report status', required: false })
    @IsOptional()
    @IsString({ message: 'status must be a string' })
    status?: string;
}

export class UpdateClientReportDto {
    @ApiProperty({ example: 'Monthly Progress Report - January', description: 'Report title', required: false })
    @IsOptional()
    @IsString({ message: 'title must be a string' })
    title?: string;

    @ApiProperty({ example: 'This report covers the progress made during January...', description: 'Detailed report description', required: false })
    @IsOptional()
    @IsString({ message: 'description must be a string' })
    description?: string;

    @ApiProperty({ example: 75, description: 'Overall progress percentage', required: false })
    @IsOptional()
    @IsNumber({}, { message: 'progressPercentage must be a number' })
    progressPercentage?: number;

    @ApiProperty({ example: 'in_progress', description: 'Report status', required: false })
    @IsOptional()
    @IsString({ message: 'status must be a string' })
    status?: string;
}
