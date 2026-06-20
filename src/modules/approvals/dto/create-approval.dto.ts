import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsObject } from 'class-validator';

export class CreateApprovalDto {
    @IsString()
    @IsNotEmpty()
    type: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    requester: string;

    @IsNumber()
    @IsOptional()
    amount?: number;

    @IsArray()
    @IsOptional()
    items?: { name: string; qty: number; unit: string }[];

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsString()
    @IsNotEmpty()
    status: string;

    @IsString()
    @IsNotEmpty()
    requestedAt: string;

    @IsString()
    @IsOptional()
    reviewedAt?: string;
}
