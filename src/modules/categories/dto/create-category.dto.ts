import { IsString, IsNotEmpty, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({ example: 'expense-type', description: 'Unique category value/key' })
    @IsString({ message: 'value must be a string' })
    @IsNotEmpty({ message: 'value is required' })
    @MaxLength(100, { message: 'value must not exceed 100 characters' })
    value: string;

    @ApiProperty({ example: 'Expense Type', description: 'Human-readable category label' })
    @IsString({ message: 'label must be a string' })
    @IsNotEmpty({ message: 'label is required' })
    @MaxLength(200, { message: 'label must not exceed 200 characters' })
    label: string;

    @ApiProperty({ example: false, description: 'Whether this is a built-in category', required: false })
    @IsBoolean({ message: 'isBuiltin must be a boolean' })
    @IsOptional()
    isBuiltin?: boolean;
}
