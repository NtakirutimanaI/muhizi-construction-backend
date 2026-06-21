import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateSubscriberDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    source?: string;
}
