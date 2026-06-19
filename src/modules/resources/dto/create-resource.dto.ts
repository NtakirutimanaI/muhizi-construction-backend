import { IsNotEmpty, IsString, IsEnum, IsOptional, IsObject } from 'class-validator';

export class CreateResourceDto {
    @IsNotEmpty()
    @IsEnum(['credential', 'link', 'note', 'event'])
    type: 'credential' | 'link' | 'note' | 'event';

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    content: string;

    @IsOptional()
    @IsObject()
    metadata: any;
}
