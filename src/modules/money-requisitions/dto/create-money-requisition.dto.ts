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

    @ApiProperty({ example: 'Finance', required: false, description: 'Department of the requester' })
    @IsString()
    @IsOptional()
    department?: string;

    @ApiProperty({ example: 'Urgent material purchase', required: false, description: 'Reason for the request' })
    @IsString()
    @IsOptional()
    reason?: string;

    @ApiProperty({ example: '2026-07-25', required: false, description: 'Requested disbursement date' })
    @IsString()
    @IsOptional()
    requestedDisbursementDate?: string;

    @ApiProperty({ required: false, description: 'Requester signature (base64 or URL)' })
    @IsString()
    @IsOptional()
    requesterSignature?: string;

    @ApiProperty({ example: 'draft', required: false, description: 'Initial status: draft or pending' })
    @IsString()
    @IsOptional()
    status?: string;
}
