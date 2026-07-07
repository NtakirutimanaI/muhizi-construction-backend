import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMaterialRequestStatusDto {
    @ApiProperty({ example: 'approved', description: 'New status for the material request' })
    @IsString({ message: 'status must be a string' })
    @IsNotEmpty({ message: 'status is required' })
    status: 'approved' | 'rejected';

    @ApiProperty({ example: 'Approved by site manager', required: false, description: 'Notes about the status change' })
    @IsString({ message: 'notes must be a string' })
    @IsOptional()
    notes?: string;
}
