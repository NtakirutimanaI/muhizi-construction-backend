import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStockApprovalDto {
    @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', description: 'UUID of the stock item to approve' })
    @IsUUID('4', { message: 'Stock ID must be a valid UUID' })
    stockId: string;

    @ApiProperty({ example: 'Approved after quality check', required: false, description: 'Approval comments' })
    @IsOptional()
    @IsString({ message: 'Comments must be a string' })
    comments?: string;

    @ApiProperty({ example: 'purchase', required: false, description: 'Type of approval request' })
    @IsOptional()
    @IsString({ message: 'Type must be a string' })
    type?: string;
}

export class UpdateStockApprovalDto {
    @ApiProperty({ example: 'approved', description: 'Approval status (approved, rejected, pending)' })
    @IsString({ message: 'Status must be a string' })
    status: string;

    @ApiProperty({ example: 'Rejected due to incorrect quantity', required: false, description: 'Updated comments on the approval' })
    @IsOptional()
    @IsString({ message: 'Comments must be a string' })
    comments?: string;
}
