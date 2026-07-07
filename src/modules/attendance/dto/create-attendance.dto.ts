import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '../entities/attendance.entity';

export class CreateAttendanceDto {
    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'UUID of the employee' })
    @IsString({ message: 'employeeId must be a string' })
    @IsNotEmpty({ message: 'employeeId is required' })
    employeeId: string;

    @ApiProperty({ example: '2024-01-15', description: 'Date of attendance record' })
    @IsDateString({}, { message: 'date must be a valid date string (YYYY-MM-DD)' })
    @IsNotEmpty({ message: 'date is required' })
    date: string;

    @ApiProperty({ example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', description: 'UUID of the project', required: false })
    @IsString({ message: 'projectId must be a string' })
    @IsOptional()
    projectId?: string;

    @ApiProperty({ example: 'Kigali Site A', description: 'Site name or location', required: false })
    @IsString({ message: 'site must be a string' })
    @IsOptional()
    site?: string;

    @ApiProperty({ example: '08:00:00', description: 'Check-in time', required: false })
    @IsString({ message: 'checkIn must be a string' })
    @IsOptional()
    checkIn?: string;

    @ApiProperty({ example: '17:00:00', description: 'Check-out time', required: false })
    @IsString({ message: 'checkOut must be a string' })
    @IsOptional()
    checkOut?: string;

    @ApiProperty({ example: AttendanceStatus.PRESENT, enum: AttendanceStatus, enumName: 'AttendanceStatus', description: 'Attendance status', required: false })
    @IsEnum(AttendanceStatus, { message: 'status must be a valid AttendanceStatus value (present, absent, late, half_day, on_leave, permission, suspended)' })
    @IsOptional()
    status?: AttendanceStatus;

    @ApiProperty({ example: 'Arrived on time', description: 'Additional notes', required: false })
    @IsString({ message: 'notes must be a string' })
    @IsOptional()
    notes?: string;
}
