import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUpdateDto {
    @ApiProperty({ example: 'New Office Building Completed', description: 'Update title' })
    @IsString({ message: 'title must be a string' })
    @IsNotEmpty({ message: 'title is required' })
    title: string;

    @ApiProperty({ example: 'new-office-building-completed', required: false, description: 'URL-friendly slug (auto-generated if omitted)' })
    @IsString({ message: 'slug must be a string' })
    @IsOptional()
    slug?: string;

    @ApiProperty({ example: 'We are pleased to announce the completion of our latest project.', required: false, description: 'Short summary' })
    @IsString({ message: 'summary must be a string' })
    @IsOptional()
    summary?: string;

    @ApiProperty({ example: 'Full article content goes here...', required: false, description: 'Full article content' })
    @IsString({ message: 'content must be a string' })
    @IsOptional()
    content?: string;

    @ApiProperty({ example: 'https://example.com/image.jpg', required: false, description: 'Cover image URL' })
    @IsString({ message: 'image must be a string' })
    @IsOptional()
    image?: string;

    @ApiProperty({ example: 'Project Update', required: false, description: 'Category label' })
    @IsString({ message: 'category must be a string' })
    @IsOptional()
    category?: string;

    @ApiProperty({ example: 'John Doe', required: false, description: 'Author name' })
    @IsString({ message: 'author must be a string' })
    @IsOptional()
    author?: string;

    @ApiProperty({ example: '5 min read', required: false, description: 'Estimated read time' })
    @IsString({ message: 'readTime must be a string' })
    @IsOptional()
    readTime?: string;

    @ApiProperty({ example: 0, required: false, description: 'Number of comments' })
    @IsNumber({}, { message: 'comments must be a number' })
    @IsOptional()
    comments?: number;

    @ApiProperty({ example: false, required: false, description: 'Whether the update is published and visible publicly' })
    @IsBoolean({ message: 'isPublished must be a boolean' })
    @IsOptional()
    isPublished?: boolean;
}
