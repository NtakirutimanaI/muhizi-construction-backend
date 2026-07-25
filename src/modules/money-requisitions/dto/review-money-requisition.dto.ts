import { IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReviewMoneyRequisitionDto {
    @ApiProperty({ example: 'approved', description: 'New status: approved or rejected' })
    @IsString()
    status: 'approved' | 'rejected';

    @ApiProperty({ example: 'Budget approved for Q3', required: false, description: 'Admin notes about the decision' })
    @IsString()
    @IsOptional()
    notes?: string;

    @ApiProperty({ example: 4500000, required: false, description: 'Modified amount if admin adjusts the request' })
    @IsNumber()
    @IsOptional()
    modifiedAmount?: number;

    @ApiProperty({ example: 'Adjusted for current prices', required: false, description: 'Reason for amount modification' })
    @IsString()
    @IsOptional()
    modificationReason?: string;

    @ApiProperty({ example: 'Papias UWIMANA', required: false, description: 'Name of the authorizer' })
    @IsString()
    @IsOptional()
    authorizedByName?: string;

    @ApiProperty({ example: 'CEO/Founder', required: false, description: 'Position of the authorizer' })
    @IsString()
    @IsOptional()
    authorizedByPosition?: string;

    @ApiProperty({ required: false, description: 'Authorizer signature (base64 or URL)' })
    @IsString()
    @IsOptional()
    authorizedBySignature?: string;

    @ApiProperty({ example: '2026-07-23', required: false, description: 'Date of authorization' })
    @IsString()
    @IsOptional()
    authorizationDate?: string;

    @ApiProperty({ required: false, description: 'Stamp image (base64 or URL)' })
    @IsString()
    @IsOptional()
    stampUrl?: string;
}
