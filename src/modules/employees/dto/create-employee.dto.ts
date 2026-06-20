import { IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail, IsNumber, IsArray, Min } from 'class-validator';
import { EmployeeStatus, Department } from '../entities/employee.entity';

export class CreateEmployeeDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsString()
    @IsOptional()
    position?: string;

    @IsEnum(Department)
    @IsOptional()
    department?: Department;

    @IsString()
    @IsOptional()
    hireDate?: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    salary?: number;

    @IsEnum(EmployeeStatus)
    @IsOptional()
    status?: EmployeeStatus;

    @IsString()
    @IsOptional()
    avatar?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsString()
    @IsOptional()
    emergencyContact?: string;

    @IsArray()
    @IsOptional()
    documents?: { name: string; url: string }[];
}
