import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class SendUpdateDto {
    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsString()
    @IsNotEmpty()
    message: string;

    @IsString()
    @IsOptional()
    html?: string;

    @IsArray()
    @IsOptional()
    subscriberIds?: string[];
}
