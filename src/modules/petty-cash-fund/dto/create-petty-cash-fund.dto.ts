import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FundStatus } from '../entities/petty-cash-fund.entity';

export class CreatePettyCashFundDto {
    @ApiProperty({ example: 'Main Office Petty Cash', description: 'Fund name' })
    @IsString()
    @IsNotEmpty()
    fundName: string;

    @ApiProperty({ example: 500000, description: 'Opening balance' })
    @IsNumber()
    @Min(0)
    openingBalance: number;

    @ApiProperty({ example: 'RWF', required: false, description: 'Currency' })
    @IsString()
    @IsOptional()
    currency?: string;

    @ApiProperty({ example: 'Jean Ndayisaba', description: 'Person responsible for the fund' })
    @IsString()
    @IsNotEmpty()
    custodian: string;

    @ApiProperty({ example: 'USR-0042', required: false, description: 'User ID of custodian' })
    @IsString()
    @IsOptional()
    custodianId?: string;

    @ApiProperty({ example: 'Petty cash for daily office expenses', required: false, description: 'Description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ enum: FundStatus, required: false, description: 'Fund status' })
    @IsEnum(FundStatus)
    @IsOptional()
    status?: FundStatus;
}
