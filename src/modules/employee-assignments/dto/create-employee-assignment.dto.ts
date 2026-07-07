import { IsString, IsNotEmpty, IsOptional, IsEnum, IsDateString, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AssignmentRole } from '../entities/employee-assignment.entity';

export class CreateEmployeeAssignmentDto {
    @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', description: 'UUID of the employee' })
    @IsString({ message: 'employeeId must be a string' })
    @IsNotEmpty({ message: 'employeeId is required' })
    employeeId: string;

    @ApiProperty({ example: 'b2c3d4e5-f6a7-8901-bcde-f12345678901', description: 'UUID of the project' })
    @IsString({ message: 'projectId must be a string' })
    @IsNotEmpty({ message: 'projectId is required' })
    projectId: string;

    @ApiProperty({ example: 'c3d4e5f6-a7b8-9012-cdef-123456789012', description: 'UUID of the site', required: false })
    @IsString({ message: 'siteId must be a string' })
    @IsOptional()
    siteId?: string;

    @ApiProperty({ example: 'Foundation work', description: 'Task assigned to the employee', required: false })
    @IsString({ message: 'task must be a string' })
    @IsOptional()
    task?: string;

    @ApiProperty({ example: AssignmentRole.WORKER, enum: AssignmentRole, enumName: 'AssignmentRole', description: 'Role of the employee in this assignment', required: false })
    @IsEnum(AssignmentRole, { message: 'role must be a valid AssignmentRole value (manager, site_manager, worker, supervisor)' })
    @IsOptional()
    role?: AssignmentRole;

    @ApiProperty({ example: '2024-01-15', description: 'Assignment start date' })
    @IsDateString({}, { message: 'startDate must be a valid date string (YYYY-MM-DD)' })
    @IsNotEmpty({ message: 'startDate is required' })
    startDate: string;

    @ApiProperty({ example: '2024-06-15', description: 'Assignment end date', required: false })
    @IsDateString({}, { message: 'endDate must be a valid date string (YYYY-MM-DD)' })
    @IsOptional()
    endDate?: string;

    @ApiProperty({ example: true, description: 'Whether the assignment is currently active', required: false })
    @IsBoolean({ message: 'isActive must be a boolean' })
    @IsOptional()
    isActive?: boolean;
}
