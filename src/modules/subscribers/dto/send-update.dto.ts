import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

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
}
