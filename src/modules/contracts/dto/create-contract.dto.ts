import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContractDto {
    @ApiProperty({ example: 'Employment Contract - John Doe', description: 'Contract title' })
    @IsString({ message: 'title must be a string' })
    @IsNotEmpty({ message: 'title is required' })
    title: string;

    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', required: false })
    @IsString()
    @IsOptional()
    employeeId?: string;

    @ApiProperty({ example: 'John Doe', description: 'Employee name' })
    @IsString({ message: 'employeeName must be a string' })
    @IsNotEmpty({ message: 'employeeName is required' })
    employeeName: string;

    @ApiProperty({ example: 'Engineering', description: 'Department' })
    @IsString({ message: 'department must be a string' })
    @IsNotEmpty({ message: 'department is required' })
    department: string;

    @ApiProperty({ example: 'full-time', description: 'Contract type' })
    @IsString({ message: 'type must be a string' })
    @IsNotEmpty({ message: 'type is required' })
    type: string;

    @ApiProperty({ example: '2024-01-01', description: 'Start date' })
    @IsString({ message: 'startDate must be a string' })
    @IsNotEmpty({ message: 'startDate is required' })
    startDate: string;

    @ApiProperty({ example: '2025-01-01', required: false })
    @IsString()
    @IsOptional()
    endDate?: string;

    @ApiProperty({ example: 'active', required: false })
    @IsString()
    @IsOptional()
    status?: string;

    @ApiProperty({ example: 500000, required: false, description: 'Basic salary in RWF' })
    @IsNumber()
    @IsOptional()
    basicSalary?: number;

    @ApiProperty({ example: 420000, required: false, description: 'Net salary in RWF' })
    @IsNumber()
    @IsOptional()
    netSalary?: number;

    @ApiProperty({ example: 'monthly', required: false })
    @IsString()
    @IsOptional()
    paymentFrequency?: string;

    @ApiProperty({ example: 'Standard working hours...', required: false })
    @IsString()
    @IsOptional()
    workingConditions?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    fileUrl?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    fileSize?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    body?: string;

    @ApiProperty({ required: false })
    @IsString()
    @IsOptional()
    footer?: string;
}
