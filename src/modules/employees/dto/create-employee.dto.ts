import { IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail, IsNumber, IsArray, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EmployeeStatus, Department } from '../entities/employee.entity';

export class CreateEmployeeDto {
    @ApiProperty({ example: 'John', description: 'Employee first name' })
    @IsString({ message: 'firstName must be a string' })
    @IsNotEmpty({ message: 'firstName is required' })
    firstName: string;

    @ApiProperty({ example: 'Doe', description: 'Employee last name' })
    @IsString({ message: 'lastName must be a string' })
    @IsNotEmpty({ message: 'lastName is required' })
    lastName: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'Employee email address' })
    @IsEmail({}, { message: 'email must be a valid email address' })
    @IsNotEmpty({ message: 'email is required' })
    email: string;

    @ApiProperty({ example: '+250-788-000-000', required: false, description: 'Employee phone number' })
    @IsString({ message: 'phone must be a string' })
    @IsOptional()
    phone?: string;

    @ApiProperty({ example: '1198000123456789', required: false, description: 'National ID number — settable once, locked after' })
    @IsString({ message: 'nationalId must be a string' })
    @IsOptional()
    nationalId?: string;

    @ApiProperty({ example: 'male', required: false, description: 'Employee gender' })
    @IsString({ message: 'gender must be a string' })
    @IsOptional()
    gender?: string;

    @ApiProperty({ example: 'married', required: false, description: 'Employee marital status' })
    @IsString({ message: 'maritalStatus must be a string' })
    @IsOptional()
    maritalStatus?: string;

    @ApiProperty({ example: "Bachelor's Degree", required: false, description: 'Employee highest education level' })
    @IsString({ message: 'educationLevel must be a string' })
    @IsOptional()
    educationLevel?: string;

    @ApiProperty({ example: 'Site Engineer', required: false, description: 'Employee job position' })
    @IsString({ message: 'position must be a string' })
    @IsOptional()
    position?: string;

    @ApiProperty({ example: 'engineering', required: false, description: 'Employee department', enum: Department })
    @IsEnum(Department, { message: 'department must be a valid department' })
    @IsOptional()
    department?: Department;

    @ApiProperty({ example: '2024-01-15', required: false, description: 'Employee hire date' })
    @IsString({ message: 'hireDate must be a string' })
    @IsOptional()
    hireDate?: string;

    @ApiProperty({ example: 75000, required: false, description: 'Employee salary' })
    @IsNumber({}, { message: 'salary must be a number' })
    @Min(0, { message: 'salary must not be negative' })
    @IsOptional()
    salary?: number;

    @ApiProperty({ example: 'active', required: false, description: 'Employee employment status', enum: EmployeeStatus })
    @IsEnum(EmployeeStatus, { message: 'status must be a valid employee status' })
    @IsOptional()
    status?: EmployeeStatus;

    @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false, description: 'Employee avatar URL' })
    @IsString({ message: 'avatar must be a string' })
    @IsOptional()
    avatar?: string;

    @ApiProperty({ example: '123 Main St, Kigali', required: false, description: 'Employee physical address' })
    @IsString({ message: 'address must be a string' })
    @IsOptional()
    address?: string;

    @ApiProperty({ example: 'Jane Doe - +250-788-000-001', required: false, description: 'Emergency contact details' })
    @IsString({ message: 'emergencyContact must be a string' })
    @IsOptional()
    emergencyContact?: string;

    @ApiProperty({ example: [{ name: 'CV', url: 'https://example.com/cv.pdf' }], required: false, description: 'Employee documents' })
    @IsArray({ message: 'documents must be an array' })
    @IsOptional()
    documents?: { name: string; url: string }[];
}
