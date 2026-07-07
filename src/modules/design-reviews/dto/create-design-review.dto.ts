import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDesignReviewDto {
    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'UUID of the design being reviewed' })
    @IsUUID('4', { message: 'designId must be a valid UUID' })
    designId: string;

    @ApiProperty({ example: 'The design looks great, but please update the dimensions.', description: 'Review comments', required: false })
    @IsOptional()
    @IsString({ message: 'comments must be a string' })
    comments?: string;
}

export class UpdateDesignReviewDto {
    @ApiProperty({ example: 'approved', description: 'Review status (approved, rejected, changes_requested)' })
    @IsString({ message: 'status must be a string' })
    status: string;

    @ApiProperty({ example: 'The design looks great, but please update the dimensions.', description: 'Review comments', required: false })
    @IsOptional()
    @IsString({ message: 'comments must be a string' })
    comments?: string;
}
