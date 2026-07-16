import { IsString, IsNotEmpty, IsOptional, IsNumber, IsArray, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateApprovalDto {
    @ApiProperty({ example: 'purchase', description: 'Type of approval request' })
    @IsString({ message: 'type must be a string' })
    @IsNotEmpty({ message: 'type is required' })
    type: string;

    @ApiProperty({ example: 'Office Supply Purchase', description: 'Title of the approval request' })
    @IsString({ message: 'title must be a string' })
    @IsNotEmpty({ message: 'title is required' })
    title: string;

    @ApiProperty({ example: 'John Doe', description: 'Name of the person requesting approval — set automatically from the authenticated user, this is ignored if sent by the client', required: false })
    @IsString({ message: 'requester must be a string' })
    @IsOptional()
    requester?: string;

    @ApiProperty({ example: 1500.0, description: 'Monetary amount associated with the request', required: false })
    @IsNumber({}, { message: 'amount must be a number' })
    @IsOptional()
    amount?: number;

    @ApiProperty({ example: [{ name: 'Item A', qty: 5, unit: 'pcs' }], description: 'List of items in the request', required: false })
    @IsArray({ message: 'items must be an array' })
    @IsOptional()
    items?: { name: string; qty: number; unit: string }[];

    @ApiProperty({ example: 'Need to purchase office supplies for Q3', description: 'Detailed description of the request' })
    @IsString({ message: 'description must be a string' })
    @IsNotEmpty({ message: 'description is required' })
    description: string;

    @ApiProperty({ example: 'pending', description: 'Current status of the approval' })
    @IsString({ message: 'status must be a string' })
    @IsNotEmpty({ message: 'status is required' })
    status: string;

    @ApiProperty({ example: '2024-01-15T08:00:00Z', description: 'Date and time the request was made' })
    @IsString({ message: 'requestedAt must be a string' })
    @IsNotEmpty({ message: 'requestedAt is required' })
    requestedAt: string;

    @ApiProperty({ example: '2024-01-16T10:30:00Z', description: 'Date and time the request was reviewed', required: false })
    @IsString({ message: 'reviewedAt must be a string' })
    @IsOptional()
    reviewedAt?: string;
}
