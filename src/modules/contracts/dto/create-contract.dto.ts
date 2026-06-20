import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateContractDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    employeeName: string;

    @IsString()
    @IsNotEmpty()
    department: string;

    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    startDate: string;

    @IsString()
    @IsOptional()
    endDate?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    fileUrl?: string;

    @IsString()
    @IsOptional()
    fileSize?: string;
}
