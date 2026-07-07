import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriberDto {
    @ApiProperty({ example: 'user@example.com', description: 'Email address of the subscriber' })
    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @ApiProperty({ example: 'website_form', required: false, description: 'Source from which the subscriber registered' })
    @IsString({ message: 'Source must be a string' })
    @IsOptional()
    source?: string;
}
