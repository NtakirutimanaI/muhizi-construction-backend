import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMoneyRequisitionDto {
    @ApiProperty({ example: 'Q3 Material Budget', required: false })
    @IsString()
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 'Funds needed for cement', required: false })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 5000000, required: false })
    @IsNumber()
    @IsOptional()
    amount?: number;

    @ApiProperty({ example: '2026-07-21', required: false })
    @IsString()
    @IsOptional()
    requestedAt?: string;

    @ApiProperty({ example: 'Finance', required: false })
    @IsString()
    @IsOptional()
    department?: string;

    @ApiProperty({ example: 'Urgent purchase', required: false })
    @IsString()
    @IsOptional()
    reason?: string;

    @ApiProperty({ example: '2026-07-25', required: false })
    @IsString()
    @IsOptional()
    requestedDisbursementDate?: string;

    @ApiProperty({ example: 'draft', required: false })
    @IsString()
    @IsOptional()
    status?: string;
}
