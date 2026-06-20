import { IsString, IsNotEmpty, IsOptional, IsEnum, IsEmail, IsDateString } from 'class-validator';
import { PartnershipType, PartnershipStatus } from '../entities/partnership.entity';

export class CreatePartnershipDto {
    @IsString()
    @IsNotEmpty()
    companyName: string;

    @IsString()
    @IsOptional()
    contactPerson?: string;

    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsEnum(PartnershipType)
    partnershipType: PartnershipType;

    @IsEnum(PartnershipStatus)
    @IsOptional()
    status?: PartnershipStatus;

    @IsString()
    @IsOptional()
    agreementFile?: string;

    @IsDateString()
    @IsOptional()
    startDate?: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;

    @IsString()
    @IsOptional()
    notes?: string;
}
