import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber, IsDateString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PettyCashType } from '../entities/petty-cash.entity';

export class CreatePettyCashDto {
    @ApiProperty({ example: 'Office supplies purchase', description: 'Description of the petty cash transaction' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 50000, description: 'Amount in RWF' })
    @IsNumber()
    @Min(0)
    amount: number;

    @ApiProperty({ enum: PettyCashType, example: PettyCashType.OUT, description: 'Type: in (money received) or out (money spent)' })
    @IsEnum(PettyCashType)
    type: PettyCashType;

    @ApiProperty({ example: '2026-07-23', description: 'Transaction date' })
    @IsDateString()
    @IsNotEmpty()
    date: string;

    @ApiProperty({ example: 'John Doe', required: false, description: 'Who gave the money (for IN transactions)' })
    @IsString()
    @IsOptional()
    receivedFrom?: string;

    @ApiProperty({ example: 'Jane Smith', required: false, description: 'Who received the money (for OUT transactions)' })
    @IsString()
    @IsOptional()
    paidTo?: string;

    @ApiProperty({ example: 'INV-001', required: false, description: 'Reference number' })
    @IsString()
    @IsOptional()
    reference?: string;

    @ApiProperty({ example: 'Bought pens and paper', required: false, description: 'Additional notes' })
    @IsString()
    @IsOptional()
    notes?: string;
}
