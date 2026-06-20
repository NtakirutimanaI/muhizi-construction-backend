import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { DesignType, DesignStatus } from '../entities/design.entity';

export class CreateDesignDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsEnum(DesignType)
    @IsOptional()
    type?: DesignType;

    @IsEnum(DesignStatus)
    @IsOptional()
    status?: DesignStatus;

    @IsString()
    @IsOptional()
    fileUrl?: string;

    @IsString()
    @IsOptional()
    thumbnailUrl?: string;

    @IsString()
    @IsOptional()
    projectId?: string;

    @IsOptional()
    metadata?: { architect?: string; scale?: string; version?: string; dimensions?: string };
}
