import { IsEmail, IsString, MinLength, IsNotEmpty, Matches, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'User email address',
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'Password123!',
        description: 'User password (minimum 8 characters, 1 capital, 1 lowercase, 1 special character)',
        minLength: 8,
        required: true,
    })
    @IsString()
    @MinLength(8)
    @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one capital letter' })
    @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
    @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, { message: 'Password must contain at least one special character' })
    @IsNotEmpty()
    password: string;

    @ApiProperty({
        example: 'John',
        description: 'First name',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({
        example: 'Doe',
        description: 'Last name',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({
        example: '+250 788 000 000',
        description: 'Phone number',
        required: false,
    })
    @IsString()
    @IsOptional()
    phone?: string;
}
