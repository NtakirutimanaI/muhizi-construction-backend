import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString, Min } from 'class-validator';
import { IncomeCategory } from '../entities/income.entity';

export class CreateIncomeDto {
    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Min(0)
    amount: number;

    @IsEnum(IncomeCategory)
    @IsOptional()
    category?: IncomeCategory;

    @IsString()
    @IsOptional()
    source?: string;

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
    reference?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
