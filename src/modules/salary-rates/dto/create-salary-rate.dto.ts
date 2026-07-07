import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSalaryRateDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', required: false, description: 'UUID of the assigned employee' })
    @IsOptional()
    @IsString({ message: 'Employee ID must be a string' })
    employeeId?: string;

    @ApiProperty({ example: 'Site Engineer', required: false, description: 'Job role or title' })
    @IsOptional()
    @IsString({ message: 'Role must be a string' })
    role?: string;

    @ApiProperty({ example: 500000, description: 'Base salary amount in RWF' })
    @IsNumber({}, { message: 'Base salary must be a number' })
    baseSalary: number;

    @ApiProperty({ example: 'permanent', required: false, description: 'Type of employment contract (permanent, contract, etc.)' })
    @IsOptional()
    @IsString({ message: 'Contract type must be a string' })
    contractType?: string;

    @ApiProperty({ example: '2025-01-01', description: 'Date when this salary rate takes effect' })
    @IsDateString({}, { message: 'Effective from must be a valid ISO 8601 date string' })
    effectiveFrom: string;

    @ApiProperty({ example: '2025-12-31', required: false, description: 'Date when this salary rate expires' })
    @IsOptional()
    @IsDateString({}, { message: 'Effective to must be a valid ISO 8601 date string' })
    effectiveTo?: string;
}

export class UpdateSalaryRateDto {
    @ApiProperty({ example: 550000, required: false, description: 'Updated base salary amount' })
    @IsOptional()
    @IsNumber({}, { message: 'Base salary must be a number' })
    baseSalary?: number;

    @ApiProperty({ example: 'contract', required: false, description: 'Updated contract type' })
    @IsOptional()
    @IsString({ message: 'Contract type must be a string' })
    contractType?: string;

    @ApiProperty({ example: '2025-06-01', required: false, description: 'Updated effective start date' })
    @IsOptional()
    @IsDateString({}, { message: 'Effective from must be a valid ISO 8601 date string' })
    effectiveFrom?: string;

    @ApiProperty({ example: '2026-06-01', required: false, description: 'Updated effective end date' })
    @IsOptional()
    @IsDateString({}, { message: 'Effective to must be a valid ISO 8601 date string' })
    effectiveTo?: string;
}
