import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSettingDto {
    @ApiProperty({ example: 'company_name', description: 'Unique setting key' })
    @IsString({ message: 'Key must be a string' })
    key: string;

    @ApiProperty({ example: 'Muhizi Construction Ltd', description: 'Setting value' })
    @IsString({ message: 'Value must be a string' })
    value: string;

    @ApiProperty({ example: 'general', required: false, description: 'Category grouping for the setting' })
    @IsOptional()
    @IsString({ message: 'Category must be a string' })
    category?: string;

    @ApiProperty({ example: 'The display name of the company', required: false, description: 'Human-readable description of the setting' })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;
}

export class UpdateSettingDto {
    @ApiProperty({ example: 'Muhizi Construction PLC', required: false, description: 'Updated setting value' })
    @IsOptional()
    @IsString({ message: 'Value must be a string' })
    value?: string;

    @ApiProperty({ example: 'branding', required: false, description: 'Updated category' })
    @IsOptional()
    @IsString({ message: 'Category must be a string' })
    category?: string;

    @ApiProperty({ example: 'The registered company name', required: false, description: 'Updated description' })
    @IsOptional()
    @IsString({ message: 'Description must be a string' })
    description?: string;
}
