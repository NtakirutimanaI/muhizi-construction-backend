import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SendUpdateDto {
    @ApiProperty({ example: 'Monthly Progress Report - June 2025', description: 'Subject line of the update email' })
    @IsString({ message: 'Subject must be a string' })
    @IsNotEmpty({ message: 'Subject is required' })
    subject: string;

    @ApiProperty({ example: 'Dear subscriber, here is the latest progress...', description: 'Plain text content of the update' })
    @IsString({ message: 'Message must be a string' })
    @IsNotEmpty({ message: 'Message is required' })
    message: string;

    @ApiProperty({ example: '<h1>Progress Report</h1><p>Dear subscriber...</p>', required: false, description: 'HTML version of the update message' })
    @IsString({ message: 'HTML must be a string' })
    @IsOptional()
    html?: string;

    @ApiProperty({ example: ['550e8400-e29b-41d4-a716-446655440000'], required: false, description: 'Array of subscriber IDs to send to (empty = all subscribers)' })
    @IsArray({ message: 'Subscriber IDs must be an array' })
    @IsOptional()
    subscriberIds?: string[];
}
