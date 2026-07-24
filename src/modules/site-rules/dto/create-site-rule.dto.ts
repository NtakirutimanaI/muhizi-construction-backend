import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSiteRuleDto {
    @ApiProperty({ example: 'Hard hats required', description: 'Title of the site rule' })
    @IsString({ message: 'Title must be a string' })
    @IsNotEmpty({ message: 'Title is required' })
    title: string;

    @ApiProperty({ example: 'hard-hat', required: false, description: 'Icon name for visual representation' })
    @IsString({ message: 'Icon name must be a string' })
    @IsOptional()
    iconName?: string;

    @ApiProperty({ example: '#FF0000', required: false, description: 'Color code for the rule pin/badge' })
    @IsString({ message: 'Pin color must be a string' })
    @IsOptional()
    pinColor?: string;

    @ApiProperty({ example: ['Must wear at all times', 'Available at the entrance'], description: 'List of detailed items for this rule' })
    @IsArray({ message: 'Items must be an array' })
    @IsString({ each: true, message: 'Each item must be a string' })
    items: string[];

    @ApiProperty({ example: 'Safety', required: false, description: 'Category/kind of this rule (e.g. Safety, Security, Operating)' })
    @IsString({ message: 'Category must be a string' })
    @IsOptional()
    category?: string;

    @ApiProperty({ example: 1, required: false, description: 'Display order priority (lower = higher)' })
    @IsNumber({}, { message: 'Order must be a number' })
    @IsOptional()
    order?: number;

    @ApiProperty({ example: true, required: false, description: 'Whether the rule is currently active' })
    @IsBoolean({ message: 'Is active must be a boolean' })
    @IsOptional()
    isActive?: boolean;
}
