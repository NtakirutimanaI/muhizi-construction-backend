import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsArray, Min, Max, IsDateString } from 'class-validator';
import { PayrollStatus } from '../entities/payroll.entity';

export class CreatePayrollDto {
    @IsString()
    @IsNotEmpty()
    employeeId: string;

    @IsNumber()
    @Min(1)
    @Max(12)
    month: number;

    @IsNumber()
    @Min(2020)
    year: number;

    @IsNumber()
    @Min(0)
    basicSalary: number;

    @IsArray()
    @IsOptional()
    allowances?: { label: string; amount: number }[];

    @IsArray()
    @IsOptional()
    deductions?: { label: string; amount: number }[];

    @IsNumber()
    @Min(0)
    @IsOptional()
    totalAllowances?: number;

    @IsNumber()
    @Min(0)
    @IsOptional()
    totalDeductions?: number;

    @IsNumber()
    @Min(0)
    netSalary: number;

    @IsEnum(PayrollStatus)
    @IsOptional()
    status?: PayrollStatus;

    @IsDateString()
    @IsOptional()
    paymentDate?: string;

    @IsString()
    @IsOptional()
    paymentMethod?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
