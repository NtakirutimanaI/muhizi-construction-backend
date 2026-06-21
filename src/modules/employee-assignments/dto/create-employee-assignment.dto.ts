import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { AssignmentRole } from '../entities/employee-assignment.entity';

export class CreateEmployeeAssignmentDto {
    @IsString()
    @IsNotEmpty()
    employeeId: string;

    @IsString()
    @IsNotEmpty()
    projectId: string;

    @IsEnum(AssignmentRole)
    @IsOptional()
    role?: AssignmentRole;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsOptional()
    endDate?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}
