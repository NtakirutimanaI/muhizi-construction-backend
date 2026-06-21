import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { AttendanceStatus } from '../entities/attendance.entity';

export class CreateAttendanceDto {
    @IsString()
    @IsNotEmpty()
    employeeId: string;

    @IsDateString()
    @IsNotEmpty()
    date: string;

    @IsString()
    @IsOptional()
    projectId?: string;

    @IsString()
    @IsOptional()
    site?: string;

    @IsString()
    @IsOptional()
    checkIn?: string;

    @IsString()
    @IsOptional()
    checkOut?: string;

    @IsEnum(AttendanceStatus)
    @IsOptional()
    status?: AttendanceStatus;

    @IsString()
    @IsOptional()
    notes?: string;
}
