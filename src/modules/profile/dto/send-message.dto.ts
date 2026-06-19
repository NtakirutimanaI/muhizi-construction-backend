import { IsEmail, IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SendMessageDto {
    @ApiProperty({
        example: 'John Doe',
        description: 'Your full name',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: 'john@example.com',
        description: 'Your email address',
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiPropertyOptional({
        example: '+250 788 123 456',
        description: 'Your phone number',
    })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({
        example: 'Tech Solutions Inc.',
        description: 'Your company name',
    })
    @IsString()
    @IsOptional()
    company?: string;

    @ApiPropertyOptional({
        example: 'Web Development Service Inquiry',
        description: 'Message subject',
    })
    @IsString()
    @IsOptional()
    subject?: string;

    @ApiProperty({
        example: 'I need help building a custom web application for my business. Can we discuss the requirements and timeline?',
        description: 'Your message (minimum 10 characters)',
        minLength: 10,
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    message: string;
}
