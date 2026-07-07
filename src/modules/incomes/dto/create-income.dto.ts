import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IncomeCategory } from '../entities/income.entity';

export class CreateIncomeDto {
    @ApiProperty({ example: 'Payment for Building A project', description: 'Income description' })
    @IsString({ message: 'description must be a string' })
    @IsNotEmpty({ message: 'description is required' })
    description: string;

    @ApiProperty({ example: 5000000, description: 'Income amount' })
    @IsNumber({}, { message: 'amount must be a number' })
    @Min(0, { message: 'amount must not be negative' })
    amount: number;

    @ApiProperty({ example: 'project_payment', required: false, description: 'Income category', enum: IncomeCategory })
    @IsEnum(IncomeCategory, { message: 'category must be a valid income category' })
    @IsOptional()
    category?: IncomeCategory;

    @ApiProperty({ example: 'Client ABC Ltd', required: false, description: 'Source of income' })
    @IsString({ message: 'source must be a string' })
    @IsOptional()
    source?: string;

    @ApiProperty({ example: 'uuid-project-id', required: false, description: 'Associated project ID' })
    @IsString({ message: 'projectId must be a string' })
    @IsOptional()
    projectId?: string;

    @ApiProperty({ example: '2024-06-15', description: 'Income date' })
    @IsDateString({}, { message: 'date must be a valid date string' })
    @IsNotEmpty({ message: 'date is required' })
    date: string;

    @ApiProperty({ example: 'bank_transfer', required: false, description: 'Payment method used' })
    @IsString({ message: 'paymentMethod must be a string' })
    @IsOptional()
    paymentMethod?: string;

    @ApiProperty({ example: 'INV-2024-001', required: false, description: 'Reference or invoice number' })
    @IsString({ message: 'reference must be a string' })
    @IsOptional()
    reference?: string;

    @ApiProperty({ example: 'Second installment received', required: false, description: 'Additional notes' })
    @IsString({ message: 'notes must be a string' })
    @IsOptional()
    notes?: string;
}
