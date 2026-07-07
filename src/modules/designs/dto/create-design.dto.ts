import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DesignType, DesignStatus } from '../entities/design.entity';

export class CreateDesignDto {
    @ApiProperty({ example: 'Modern Villa Design', description: 'Design title' })
    @IsString({ message: 'title must be a string' })
    @IsNotEmpty({ message: 'title is required' })
    title: string;

    @ApiProperty({ example: 'A modern villa with 4 bedrooms and a pool', description: 'Design description', required: false })
    @IsString({ message: 'description must be a string' })
    @IsOptional()
    description?: string;

    @ApiProperty({ example: DesignType.ARCHITECTURAL, enum: DesignType, enumName: 'DesignType', description: 'Type of design', required: false })
    @IsEnum(DesignType, { message: 'type must be a valid DesignType value (architectural, structural, interior, landscape)' })
    @IsOptional()
    type?: DesignType;

    @ApiProperty({ example: DesignStatus.DRAFT, enum: DesignStatus, enumName: 'DesignStatus', description: 'Design status', required: false })
    @IsEnum(DesignStatus, { message: 'status must be a valid DesignStatus value (draft, approved, rejected)' })
    @IsOptional()
    status?: DesignStatus;

    @ApiProperty({ example: 'https://example.com/designs/design-123.pdf', description: 'URL to the design file', required: false })
    @IsString({ message: 'fileUrl must be a string' })
    @IsOptional()
    fileUrl?: string;

    @ApiProperty({ example: 'https://example.com/thumbnails/design-123.jpg', description: 'URL to the design thumbnail image', required: false })
    @IsString({ message: 'thumbnailUrl must be a string' })
    @IsOptional()
    thumbnailUrl?: string;

    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'UUID of the associated project', required: false })
    @IsString({ message: 'projectId must be a string' })
    @IsOptional()
    projectId?: string;

    @ApiProperty({ example: { architect: 'Jane Smith', scale: '1:100', version: 'v2', dimensions: 'A0' }, description: 'Additional design metadata', required: false })
    @IsOptional()
    metadata?: { architect?: string; scale?: string; version?: string; dimensions?: string };
}
