import { IsOptional, IsBoolean, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSubscriberDto {
    @ApiProperty({ example: false, required: false, description: 'Whether the subscriber is active' })
    @IsBoolean({ message: 'Is active must be a boolean' })
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ example: 85, required: false, description: 'Machine learning engagement score (0-100)' })
    @IsNumber({}, { message: 'ML score must be a number' })
    @IsOptional()
    mlScore?: number;

    @ApiProperty({ example: 'highly_engaged', required: false, description: 'ML-based subscriber category' })
    @IsString({ message: 'ML category must be a string' })
    @IsOptional()
    mlCategory?: string;
}
