import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateMaterialRequestStatusDto {
    @IsString()
    @IsNotEmpty()
    status: 'approved' | 'rejected';

    @IsString()
    @IsOptional()
    notes?: string;
}
