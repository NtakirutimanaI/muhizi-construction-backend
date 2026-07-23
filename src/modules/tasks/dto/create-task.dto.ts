import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
    @ApiProperty({ example: 'Review foundation design drawings' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ example: 'Review the structural foundation drawings for Site B and provide feedback.' })
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiPropertyOptional({ enum: TaskPriority, default: TaskPriority.MEDIUM })
    @IsOptional()
    @IsEnum(TaskPriority)
    priority?: TaskPriority;

    @ApiProperty({ example: 'user-uuid-of-engineering-studio-member' })
    @IsString()
    @IsNotEmpty()
    assignedTo: string;

    @ApiProperty({ example: 'John Doe' })
    @IsString()
    @IsNotEmpty()
    assignedToName: string;

    @ApiPropertyOptional({ example: '2026-07-30' })
    @IsOptional()
    @IsString()
    dueDate?: string;

    @ApiPropertyOptional({ example: 'Please complete before end of week.' })
    @IsOptional()
    @IsString()
    notes?: string;
}
