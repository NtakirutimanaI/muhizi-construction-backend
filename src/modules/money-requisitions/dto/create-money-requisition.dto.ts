import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMoneyRequisitionDto {
    @ApiProperty({ example: 'Q3 Material Budget', description: 'Title of the money requisition' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Funds needed for cement and steel purchases', description: 'Description of the requisition' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ example: 5000000, description: 'Amount requested in RWF' })
    @IsNumber()
    @IsNotEmpty()
    amount: number;

    @ApiProperty({ example: '2026-07-21', description: 'Date of the request' })
    @IsString()
    @IsNotEmpty()
    requestedAt: string;
}
