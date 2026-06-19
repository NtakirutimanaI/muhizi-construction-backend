import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';
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
        example: 'johndoe',
        description: 'Username (unique)',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    username: string;

    @ApiProperty({
        example: 'Password123!',
        description: 'User password (minimum 6 characters)',
        minLength: 6,
        required: true,
    })
    @IsString()
    @MinLength(6)
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
}
