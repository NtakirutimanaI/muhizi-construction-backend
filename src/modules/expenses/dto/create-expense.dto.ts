import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString, Min } from 'class-validator';
import { ExpenseCategory } from '../entities/expense.entity';

export class CreateExpenseDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(0)
    amount: number;

    @IsEnum(ExpenseCategory)
    @IsOptional()
    category?: ExpenseCategory;

    @IsString()
    @IsOptional()
    projectId?: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsOptional()
    paymentMethod?: string;

    @IsString()
    @IsOptional()
    receipt?: string;

    @IsString()
    @IsOptional()
    vendor?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
