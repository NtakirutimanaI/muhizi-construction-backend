import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class RecordVisitDto {
    @ApiPropertyOptional({ example: 'John Doe', description: 'Visitor name' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: 'john@example.com', description: 'Visitor email' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({ example: 'Tech Corp', description: 'Visitor company' })
    @IsString()
    @IsOptional()
    company?: string;

    @ApiPropertyOptional({ example: 'Kigali, Rwanda', description: 'Visitor location' })
    @IsString()
    @IsOptional()
    location?: string;

    @ApiPropertyOptional({ example: '/', description: 'Page visited' })
    @IsString()
    @IsOptional()
    page?: string;

    @ApiPropertyOptional({ example: 'https://google.com', description: 'Referrer URL' })
    @IsString()
    @IsOptional()
    referrer?: string;
}
