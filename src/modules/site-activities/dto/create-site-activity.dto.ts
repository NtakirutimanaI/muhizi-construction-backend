import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateSiteActivityDto {
    @IsString()
    @IsNotEmpty()
    project: string;

    @IsString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsNumber()
    @IsNotEmpty()
    workers: number;

    @IsString()
    @IsOptional()
    notes?: string;
}
