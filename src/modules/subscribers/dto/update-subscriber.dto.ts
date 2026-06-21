import { IsOptional, IsBoolean, IsNumber, IsString } from 'class-validator';

export class UpdateSubscriberDto {
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsNumber()
    @IsOptional()
    mlScore?: number;

    @IsString()
    @IsOptional()
    mlCategory?: string;
}
