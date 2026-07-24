import { IsString, IsNotEmpty, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '../entities/petty-cash-transaction.entity';

export class CreatePettyCashTransactionDto {
    @ApiProperty({ example: 'uuid-of-fund', description: 'Petty cash fund ID' })
    @IsString()
    @IsNotEmpty()
    fundId: string;

    @ApiProperty({ example: 'uuid-of-voucher', required: false, description: 'Petty cash voucher ID' })
    @IsString()
    @IsOptional()
    voucherId?: string;

    @ApiProperty({ enum: TransactionType, description: 'Transaction type' })
    @IsEnum(TransactionType)
    @IsNotEmpty()
    transactionType: TransactionType;

    @ApiProperty({ example: 50000, description: 'Transaction amount' })
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty({ example: 'Purchase of office supplies', required: false, description: 'Description' })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ example: 'REF-001', required: false, description: 'Reference' })
    @IsString()
    @IsOptional()
    reference?: string;
}
