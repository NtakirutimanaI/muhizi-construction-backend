import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSiteActivityDto {
    @ApiProperty({ example: 'Kigali Heights', description: 'Name or ID of the project' })
    @IsString({ message: 'Project must be a string' })
    @IsNotEmpty({ message: 'Project is required' })
    project: string;

    @ApiProperty({ example: '2025-06-15', description: 'Date of the activity' })
    @IsString({ message: 'Date must be a string' })
    @IsNotEmpty({ message: 'Date is required' })
    date: string;

    @ApiProperty({ example: 'Poured concrete for foundation slab', description: 'Detailed description of the activity' })
    @IsString({ message: 'Description must be a string' })
    @IsNotEmpty({ message: 'Description is required' })
    description: string;

    @ApiProperty({ example: 'completed', description: 'Current status of the activity' })
    @IsString({ message: 'Status must be a string' })
    @IsNotEmpty({ message: 'Status is required' })
    status: string;

    @ApiProperty({ example: 12, description: 'Number of workers assigned' })
    @IsNumber({}, { message: 'Workers must be a number' })
    @IsNotEmpty({ message: 'Workers count is required' })
    workers: number;

    @ApiProperty({ example: 'All safety protocols followed', required: false, description: 'Additional notes about the activity' })
    @IsString({ message: 'Notes must be a string' })
    @IsOptional()
    notes?: string;
}
