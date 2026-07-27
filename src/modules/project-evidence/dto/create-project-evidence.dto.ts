import { IsString, IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectEvidenceDto {
    @ApiProperty({ example: 'uuid-project-id', description: 'Associated project ID' })
    @IsString({ message: 'project must be a string' })
    @IsNotEmpty({ message: 'project is required' })
    project: string;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', required: false, description: 'UUID of the site this evidence belongs to' })
    @IsUUID('4', { message: 'Site ID must be a valid UUID' })
    @IsOptional()
    siteId?: string;

    @ApiProperty({ example: 'photo', description: 'Type of evidence (photo, document, video, etc.)' })
    @IsString({ message: 'type must be a string' })
    @IsNotEmpty({ message: 'type is required' })
    type: string;

    @ApiProperty({ example: 'Foundation Completion Photo', description: 'Evidence title' })
    @IsString({ message: 'title must be a string' })
    @IsNotEmpty({ message: 'title is required' })
    title: string;

    @ApiProperty({ example: 'https://example.com/evidence.jpg', description: 'URL of the evidence file' })
    @IsString({ message: 'url must be a string' })
    @IsNotEmpty({ message: 'url is required' })
    url: string;

    @ApiProperty({ example: '2024-06-10', description: 'Date of the evidence' })
    @IsString({ message: 'date must be a string' })
    @IsNotEmpty({ message: 'date is required' })
    date: string;

    @ApiProperty({ example: 'Foundation completed ahead of schedule', required: false, description: 'Additional notes' })
    @IsString({ message: 'notes must be a string' })
    @IsOptional()
    notes?: string;

    @ApiProperty({ example: true, required: false, description: 'Whether this evidence is approved for client viewing' })
    @IsBoolean({ message: 'approvedForClient must be a boolean' })
    @IsOptional()
    approvedForClient?: boolean;
}
