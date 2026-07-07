import { IsEmail, IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'Registered email address',
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: '123456',
        description: 'OTP code sent via email',
        required: true,
    })
    @IsString()
    @IsNotEmpty()
    otp: string;

    @ApiProperty({
        example: 'NewPassword123!',
        description: 'New password (minimum 8 characters, 1 capital, 1 lowercase, 1 special character)',
        minLength: 8,
        required: true,
    })
    @IsString()
    @MinLength(8)
    @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one capital letter' })
    @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
    @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, { message: 'Password must contain at least one special character' })
    @IsNotEmpty()
    newPassword: string;
}
