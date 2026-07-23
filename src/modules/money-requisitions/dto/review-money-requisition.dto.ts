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
}
