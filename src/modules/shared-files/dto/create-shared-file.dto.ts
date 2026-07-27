import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ShareRecipientType } from '../entities/shared-file.entity';

export class CreateSharedFileDto {
    @IsString()
    designId: string;

    @IsString()
    sharedTo: string;

    @IsString()
    @IsOptional()
    recipientName?: string;

    @IsEnum(ShareRecipientType)
    recipientType: ShareRecipientType;

    @IsString()
    @IsOptional()
    projectId?: string;

    @IsString()
    @IsOptional()
    projectName?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
