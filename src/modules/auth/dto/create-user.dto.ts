import { IsEmail, IsString, MinLength, IsNotEmpty, IsOptional, IsIn, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../enums/role.enum';

export class CreateUserDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'Password123!', minLength: 8 })
    @IsString()
    @MinLength(8)
    @Matches(/(?=.*[A-Z])/, { message: 'Password must contain at least one capital letter' })
    @Matches(/(?=.*[a-z])/, { message: 'Password must contain at least one lowercase letter' })
    @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, { message: 'Password must contain at least one special character' })
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: 'John' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: 'storekeeper', enum: Object.values(Role), default: 'storekeeper' })
    @IsString()
    @IsOptional()
    @IsIn(Object.values(Role))
    role?: string;

    @ApiProperty({ example: '+250 788 000 000', required: false })
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiProperty({ example: 'Kigali, Rwanda', required: false })
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty({ example: 'Male', required: false })
    @IsString()
    @IsOptional()
    gender?: string;

    @ApiProperty({ example: 'Single', required: false })
    @IsString()
    @IsOptional()
    maritalStatus?: string;

    @ApiProperty({ example: '1199980012345678', required: false })
    @IsString()
    @IsOptional()
    nationalId?: string;

    @ApiProperty({ example: 'Bachelor\'s Degree', required: false })
    @IsString()
    @IsOptional()
    educationLevel?: string;

    @ApiProperty({ example: 'RSSB', required: false })
    @IsString()
    @IsOptional()
    medicalInsurance?: string;

    @ApiProperty({ example: 'https://cloudinary.com/contract.pdf', required: false })
    @IsString()
    @IsOptional()
    contractUrl?: string;

    @ApiProperty({ example: 'BK:00986883, Equity:08788888', required: false })
    @IsString()
    @IsOptional()
    bankAccount?: string;

    @ApiProperty({ example: 'employed', required: false })
    @IsString()
    @IsOptional()
    employmentStatus?: string;

    @ApiProperty({ example: 'Masonry', required: false })
    @IsString()
    @IsOptional()
    employmentCategory?: string;

    @ApiProperty({ example: 'day', required: false })
    @IsString()
    @IsOptional()
    workShift?: string;

    @ApiProperty({ example: 500000, required: false, description: 'Basic salary in RWF' })
    @IsOptional()
    basicSalary?: number;
}
