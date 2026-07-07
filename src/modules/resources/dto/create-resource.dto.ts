import { IsNotEmpty, IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateResourceDto {
    @ApiProperty({ example: 'credential', description: 'Resource type', enum: ['credential', 'link', 'note', 'event'] })
    @IsNotEmpty({ message: 'type is required' })
    @IsEnum(['credential', 'link', 'note', 'event'], { message: 'type must be one of: credential, link, note, event' })
    type: 'credential' | 'link' | 'note' | 'event';

    @ApiProperty({ example: 'AWS Console Login', description: 'Resource title' })
    @IsNotEmpty({ message: 'title is required' })
    @IsString({ message: 'title must be a string' })
    title: string;

    @ApiProperty({ example: 'https://aws.amazon.com/console', required: false, description: 'Resource content or URL' })
    @IsOptional()
    @IsString({ message: 'content must be a string' })
    content: string;

    @ApiProperty({ example: { username: 'admin', url: 'https://example.com' }, required: false, description: 'Additional metadata as key-value pairs' })
    @IsOptional()
    @IsObject({ message: 'metadata must be an object' })
    metadata: any;
}
