import { IsString, IsNotEmpty, IsOptional, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDailyReportDto {
    @ApiProperty({ example: '2026-07-17', required: false, description: 'Date the report covers (defaults to today)' })
    @IsString({ message: 'date must be a string' })
    @IsOptional()
    date?: string;

    @ApiProperty({ example: 'Site A foundation pour completed. Site B awaiting cement delivery. No safety incidents.', description: 'Summary of the day\'s operations across sites, stock, and requests' })
    @IsString({ message: 'summary must be a string' })
    @IsNotEmpty({ message: 'summary is required' })
    @MinLength(10, { message: 'summary must be at least 10 characters' })
    @MaxLength(5000, { message: 'summary must not exceed 5000 characters' })
    summary: string;
}
