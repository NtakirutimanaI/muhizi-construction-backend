import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ExpenseCategory } from '../entities/expense.entity';

export class CreateExpenseDto {
    @ApiProperty({ example: 'Purchased cement for foundation', description: 'Expense description' })
    @IsString({ message: 'description must be a string' })
    @IsNotEmpty({ message: 'description is required' })
    description: string;

    @ApiProperty({ example: 150000, description: 'Expense amount' })
    @IsNumber({}, { message: 'amount must be a number' })
    @Min(0, { message: 'amount must not be negative' })
    amount: number;

    @ApiProperty({ example: 'materials', required: false, description: 'Expense category', enum: ExpenseCategory })
    @IsEnum(ExpenseCategory, { message: 'category must be a valid expense category' })
    @IsOptional()
    category?: ExpenseCategory;

    @ApiProperty({ example: 'uuid-project-id', required: false, description: 'Associated project ID' })
    @IsString({ message: 'projectId must be a string' })
    @IsOptional()
    projectId?: string;

    @ApiProperty({ example: '2024-06-15', description: 'Expense date' })
    @IsDateString({}, { message: 'date must be a valid date string' })
    @IsNotEmpty({ message: 'date is required' })
    date: string;

    @ApiProperty({ example: 'bank_transfer', required: false, description: 'Payment method used' })
    @IsString({ message: 'paymentMethod must be a string' })
    @IsOptional()
    paymentMethod?: string;

    @ApiProperty({ example: 'https://example.com/receipt.pdf', required: false, description: 'Receipt file URL' })
    @IsString({ message: 'receipt must be a string' })
    @IsOptional()
    receipt?: string;

    @ApiProperty({ example: 'Kigali Cement Ltd', required: false, description: 'Vendor or supplier name' })
    @IsString({ message: 'vendor must be a string' })
    @IsOptional()
    vendor?: string;

    @ApiProperty({ example: 'Paid via mobile money', required: false, description: 'Additional notes' })
    @IsString({ message: 'notes must be a string' })
    @IsOptional()
    notes?: string;
}
