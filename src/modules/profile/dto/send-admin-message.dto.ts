import { IsEmail, IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendAdminMessageDto {
    @ApiProperty({ example: 'John Doe', description: 'Recipient name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'john@example.com', description: 'Recipient email' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiPropertyOptional({ example: '+250 788 123 456', description: 'Recipient phone' })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({ example: 'Tech Solutions Inc.', description: 'Recipient company' })
    @IsString()
    @IsOptional()
    company?: string;

    @ApiPropertyOptional({ example: 'Service Confirmation', description: 'Message subject' })
    @IsString()
    @IsOptional()
    subject?: string;

    @ApiProperty({ example: 'Thank you for reaching out...', description: 'Message body' })
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    message: string;
}
