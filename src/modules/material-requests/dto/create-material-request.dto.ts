import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateMaterialRequestDto {
    @IsString()
    @IsNotEmpty()
    project: string;

    @IsString()
    @IsNotEmpty()
    material: string;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsString()
    @IsOptional()
    unit?: string;

    @IsString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
