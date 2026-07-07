import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContractDto {
    @ApiProperty({ example: 'Employment Contract - John Doe', description: 'Contract title' })
    @IsString({ message: 'title must be a string' })
    @IsNotEmpty({ message: 'title is required' })
    title: string;

    @ApiProperty({ example: 'John Doe', description: 'Employee name covered by the contract' })
    @IsString({ message: 'employeeName must be a string' })
    @IsNotEmpty({ message: 'employeeName is required' })
    employeeName: string;

    @ApiProperty({ example: 'Engineering', description: 'Department the employee belongs to' })
    @IsString({ message: 'department must be a string' })
    @IsNotEmpty({ message: 'department is required' })
    department: string;

    @ApiProperty({ example: 'full-time', description: 'Contract type' })
    @IsString({ message: 'type must be a string' })
    @IsNotEmpty({ message: 'type is required' })
    type: string;

    @ApiProperty({ example: '2024-01-01', description: 'Contract start date' })
    @IsString({ message: 'startDate must be a string' })
    @IsNotEmpty({ message: 'startDate is required' })
    startDate: string;

    @ApiProperty({ example: '2025-01-01', description: 'Contract end date', required: false })
    @IsString({ message: 'endDate must be a string' })
    @IsOptional()
    endDate?: string;

    @ApiProperty({ example: 'active', description: 'Current contract status', required: false })
    @IsString({ message: 'status must be a string' })
    @IsOptional()
    status?: string;

    @ApiProperty({ example: 'https://example.com/contracts/contract-123.pdf', description: 'URL to the contract file', required: false })
    @IsString({ message: 'fileUrl must be a string' })
    @IsOptional()
    fileUrl?: string;

    @ApiProperty({ example: '1.2 MB', description: 'File size of the contract document', required: false })
    @IsString({ message: 'fileSize must be a string' })
    @IsOptional()
    fileSize?: string;

    @ApiProperty({ example: 'This agreement is entered into on...', description: 'Contract body text', required: false })
    @IsString({ message: 'body must be a string' })
    @IsOptional()
    body?: string;

    @ApiProperty({ example: 'Signed by both parties on...', description: 'Contract footer text', required: false })
    @IsString({ message: 'footer must be a string' })
    @IsOptional()
    footer?: string;
}
