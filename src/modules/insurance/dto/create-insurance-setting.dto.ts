import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInsuranceSettingDto {
    @ApiProperty({ example: 'RSSB' })
    @IsString()
    @IsNotEmpty()
    provider: string;

    @ApiProperty({ example: 'RSSB Health Insurance' })
    @IsString()
    @IsNotEmpty()
    label: string;

    @ApiProperty({ example: 59200, description: 'Amount deducted from employee salary' })
    @IsNumber()
    employeeAmount: number;

    @ApiProperty({ example: 59200, description: 'Amount paid by employer' })
    @IsNumber()
    @IsOptional()
    employerAmount?: number;

    @ApiProperty({ example: 'Company health insurance for all contracted employees', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
