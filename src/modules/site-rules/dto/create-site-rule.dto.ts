import { IsString, IsNotEmpty, IsOptional, IsArray, IsNumber, IsBoolean } from 'class-validator';

export class CreateSiteRuleDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    iconName?: string;

    @IsString()
    @IsOptional()
    pinColor?: string;

    @IsArray()
    @IsString({ each: true })
    items: string[];

    @IsNumber()
    @IsOptional()
    order?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
