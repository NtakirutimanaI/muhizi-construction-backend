import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEngineeringSubmissionDto {
    @ApiProperty({ example: 'Foundation Design Report - Site B', description: 'Submission title' })
    @IsString({ message: 'title must be a string' })
    @IsNotEmpty({ message: 'title is required' })
    title: string;

    @ApiProperty({ example: 'Detailed structural analysis and foundation design for Site B including soil test results and reinforcement specifications.', description: 'Detailed description of the submission' })
    @IsString({ message: 'description must be a string' })
    @IsNotEmpty({ message: 'description is required' })
    description: string;

    @ApiProperty({ example: [{ name: 'Design Report', url: 'https://res.cloudinary.com/.../report.pdf', type: 'pdf' }], description: 'Array of uploaded document URLs', required: false })
    @IsArray({ message: 'documentUrls must be an array' })
    @IsOptional()
    documentUrls?: { name: string; url: string; type: string }[];

    @ApiProperty({ example: 'uuid-of-task', description: 'Link to assigned task', required: false })
    @IsString()
    @IsOptional()
    taskId?: string;
}
