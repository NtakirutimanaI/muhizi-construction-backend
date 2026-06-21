import { IsString, IsOptional, IsNumber, IsArray } from 'class-validator';

export class UpdateApprovalDto {
    @IsString()
    @IsOptional()
    type?: string;

    @IsString()
    @IsOptional()
    title?: string;

    @IsString()
    @IsOptional()
    requester?: string;

    @IsNumber()
    @IsOptional()
    amount?: number;

    @IsArray()
    @IsOptional()
    items?: { name: string; qty: number; unit: string }[];

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    status?: string;

    @IsString()
    @IsOptional()
    requestedAt?: string;

    @IsString()
    @IsOptional()
    reviewedAt?: string;
}
