import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray, Min, Max, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PayrollStatus } from '../entities/payroll.entity';

export class CreatePayrollDto {
    @ApiProperty({ example: 'uuid-employee-id', description: 'Employee ID' })
    @IsString({ message: 'employeeId must be a string' })
    @IsNotEmpty({ message: 'employeeId is required' })
    employeeId: string;

    @ApiProperty({ example: 6, description: 'Payroll month (1-12)' })
    @IsNumber({}, { message: 'month must be a number' })
    @Min(1, { message: 'month must be between 1 and 12' })
    @Max(12, { message: 'month must be between 1 and 12' })
    month: number;

    @ApiProperty({ example: 2024, description: 'Payroll year' })
    @IsNumber({}, { message: 'year must be a number' })
    @Min(2020, { message: 'year must be 2020 or later' })
    year: number;

    @ApiProperty({ example: 500000, description: 'Basic salary amount' })
    @IsNumber({}, { message: 'basicSalary must be a number' })
    @Min(0, { message: 'basicSalary must not be negative' })
    basicSalary: number;

    @ApiProperty({ example: [{ label: 'Housing Allowance', amount: 100000 }], required: false, description: 'List of allowances' })
    @IsArray({ message: 'allowances must be an array' })
    @IsOptional()
    allowances?: { label: string; amount: number }[];

    @ApiProperty({ example: [{ label: 'Tax', amount: 50000 }], required: false, description: 'List of deductions' })
    @IsArray({ message: 'deductions must be an array' })
    @IsOptional()
    deductions?: { label: string; amount: number }[];

    @ApiProperty({ example: 100000, required: false, description: 'Total allowances amount' })
    @IsNumber({}, { message: 'totalAllowances must be a number' })
    @Min(0, { message: 'totalAllowances must not be negative' })
    @IsOptional()
    totalAllowances?: number;

    @ApiProperty({ example: 50000, required: false, description: 'Total deductions amount' })
    @IsNumber({}, { message: 'totalDeductions must be a number' })
    @Min(0, { message: 'totalDeductions must not be negative' })
    @IsOptional()
    totalDeductions?: number;

    @ApiProperty({ example: 550000, description: 'Net salary after allowances and deductions' })
    @IsNumber({}, { message: 'netSalary must be a number' })
    @Min(0, { message: 'netSalary must not be negative' })
    netSalary: number;

    @ApiProperty({ example: 'pending', required: false, description: 'Payroll status', enum: PayrollStatus })
    @IsEnum(PayrollStatus, { message: 'status must be a valid payroll status' })
    @IsOptional()
    status?: PayrollStatus;

    @ApiProperty({ example: '2024-07-01', required: false, description: 'Date the payment was made' })
    @IsDateString({}, { message: 'paymentDate must be a valid date string' })
    @IsOptional()
    paymentDate?: string;

    @ApiProperty({ example: 'bank_transfer', required: false, description: 'Payment method used' })
    @IsString({ message: 'paymentMethod must be a string' })
    @IsOptional()
    paymentMethod?: string;

    @ApiProperty({ example: 'Overtime included', required: false, description: 'Additional notes' })
    @IsString({ message: 'notes must be a string' })
    @IsOptional()
    notes?: string;
}
