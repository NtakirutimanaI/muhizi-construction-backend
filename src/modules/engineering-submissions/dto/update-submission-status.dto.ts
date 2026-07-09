import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SubmissionStatus } from '../entities/engineering-submission.entity';

export class UpdateSubmissionStatusDto {
    @ApiProperty({ example: SubmissionStatus.APPROVED, enum: SubmissionStatus, description: 'New submission status' })
    @IsEnum(SubmissionStatus, { message: 'status must be a valid submission status' })
    @IsNotEmpty({ message: 'status is required' })
    status: SubmissionStatus;

    @ApiProperty({ example: 'Design meets all requirements. Proceed to implementation.', required: false, description: 'Review notes from the managing director' })
    @IsString({ message: 'reviewNotes must be a string' })
    @IsOptional()
    reviewNotes?: string;
}
