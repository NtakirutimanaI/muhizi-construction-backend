import { IsString, IsNotEmpty, IsOptional, IsNumber, IsIn, Min, MaxLength, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStockDto {
    @ApiProperty({ example: 'Portland Cement Type I', description: 'Name of the stock item' })
    @IsString({ message: 'Item must be a string' })
    @IsNotEmpty({ message: 'Item is required' })
    @MaxLength(255, { message: 'Item must not exceed 255 characters' })
    item: string;

    @ApiProperty({ example: 'Construction Materials', required: false, description: 'Category of the stock item' })
    @IsString({ message: 'Category must be a string' })
    @IsOptional()
    @MaxLength(100, { message: 'Category must not exceed 100 characters' })
    category?: string;

    @ApiProperty({ example: 'in', description: 'Transaction type: in (stock received) or out (stock issued)' })
    @IsString({ message: 'Type must be a string' })
    @IsNotEmpty({ message: 'Type is required' })
    @IsIn(['in', 'out'], { message: 'Type must be either "in" or "out"' })
    type: 'in' | 'out';

    @ApiProperty({ example: 50, description: 'Quantity of stock items' })
    @IsNumber({}, { message: 'Quantity must be a number' })
    @Min(0.001, { message: 'Quantity must be greater than 0' })
    quantity: number;

    @ApiProperty({ example: 'bags', required: false, description: 'Unit of measurement (e.g., bags, pieces, liters)' })
    @IsString({ message: 'Unit must be a string' })
    @IsOptional()
    @MaxLength(100, { message: 'Unit must not exceed 100 characters' })
    unit?: string;

    @ApiProperty({ example: 25000, required: false, description: 'Price per unit in RWF' })
    @IsNumber({}, { message: 'Unit price must be a number' })
    @Min(0, { message: 'Unit price must not be negative' })
    @IsOptional()
    unitPrice?: number;

    @ApiProperty({ example: '2025-06-20', description: 'Date of the stock transaction' })
    @IsString({ message: 'Date must be a string' })
    @IsNotEmpty({ message: 'Date is required' })
    date: string;

    @ApiProperty({ example: '14:30', required: false, description: 'Time of the stock transaction (HH:mm)' })
    @IsString({ message: 'Time must be a string' })
    @IsOptional()
    @MaxLength(10, { message: 'Time must not exceed 10 characters' })
    time?: string;

    @ApiProperty({ example: 'INV-2025-001', required: false, description: 'Reference number (invoice, PO, etc.)' })
    @IsString({ message: 'Reference must be a string' })
    @IsOptional()
    @MaxLength(200, { message: 'Reference must not exceed 200 characters' })
    reference?: string;

    @ApiProperty({ example: 'Delivered to site warehouse', required: false, description: 'Additional notes about the transaction' })
    @IsString({ message: 'Notes must be a string' })
    @IsOptional()
    @MaxLength(1000, { message: 'Notes must not exceed 1000 characters' })
    notes?: string;

    @ApiProperty({ example: ['https://cdn.example.com/receipt1.jpg'], required: false, description: 'Photo evidence URLs (delivery note, goods received/dispatched)' })
    @IsArray({ message: 'Evidence must be an array of URLs' })
    @IsString({ each: true, message: 'Each evidence entry must be a URL string' })
    @IsOptional()
    evidenceUrls?: string[];
}
