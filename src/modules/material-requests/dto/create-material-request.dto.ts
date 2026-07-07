import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMaterialRequestDto {
    @ApiProperty({ example: 'uuid-project-id', description: 'Associated project ID' })
    @IsString({ message: 'project must be a string' })
    @IsNotEmpty({ message: 'project is required' })
    project: string;

    @ApiProperty({ example: 'Cement', description: 'Material name' })
    @IsString({ message: 'material must be a string' })
    @IsNotEmpty({ message: 'material is required' })
    material: string;

    @ApiProperty({ example: 50, description: 'Quantity of material requested' })
    @IsNumber({}, { message: 'quantity must be a number' })
    @IsNotEmpty({ message: 'quantity is required' })
    quantity: number;

    @ApiProperty({ example: 'bags', required: false, description: 'Unit of measurement' })
    @IsString({ message: 'unit must be a string' })
    @IsOptional()
    unit?: string;

    @ApiProperty({ example: '2024-06-15', description: 'Date of the request' })
    @IsString({ message: 'date must be a string' })
    @IsNotEmpty({ message: 'date is required' })
    date: string;

    @ApiProperty({ example: 'pending', required: false, description: 'Request status' })
    @IsString({ message: 'status must be a string' })
    @IsOptional()
    status?: string;

    @ApiProperty({ example: 15000, required: false, description: 'Unit price of the material' })
    @IsNumber({}, { message: 'unitPrice must be a number' })
    @IsOptional()
    unitPrice?: number;

    @ApiProperty({ example: 'Need urgently for foundation work', required: false, description: 'Additional notes' })
    @IsString({ message: 'notes must be a string' })
    @IsOptional()
    notes?: string;
}
