import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
    @ApiProperty({
        example: 'user@example.com',
        description: 'Registered email address',
        required: true,
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}
