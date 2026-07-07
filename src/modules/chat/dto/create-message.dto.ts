import { IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
    @ApiProperty({ example: 'abc123-session-id', description: 'Unique session identifier for the conversation' })
    @IsNotEmpty({ message: 'sessionId is required' })
    @IsString({ message: 'sessionId must be a string' })
    sessionId: string;

    @ApiProperty({ example: 'Hello, I need assistance with my project.', description: 'Message content' })
    @IsNotEmpty({ message: 'content is required' })
    @IsString({ message: 'content must be a string' })
    content: string;

    @ApiProperty({ example: 'user@example.com', description: 'Sender email address', required: false })
    @IsOptional()
    @IsString({ message: 'email must be a string' })
    email?: string;

    @ApiProperty({ example: 'Kigali, Rwanda', description: 'Sender location', required: false })
    @IsOptional()
    @IsString({ message: 'location must be a string' })
    location?: string;

    @ApiProperty({ example: '192.168.1.1', description: 'Sender IP address', required: false })
    @IsOptional()
    @IsString({ message: 'ipAddress must be a string' })
    ipAddress?: string;

    @ApiProperty({ example: 'Mobile', description: 'Device type used to send the message', required: false })
    @IsOptional()
    @IsString({ message: 'device must be a string' })
    device?: string;
}
