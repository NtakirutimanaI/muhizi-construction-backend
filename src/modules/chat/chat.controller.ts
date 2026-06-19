import { Controller, Post, Body, Get, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Post('message')
    async sendMessage(@Body() createMessageDto: CreateMessageDto) {
        return this.chatService.handleUserMessage(createMessageDto);
    }

    @Get('history/:sessionId')
    async getHistory(@Param('sessionId') sessionId: string) {
        return this.chatService.getHistory(sessionId);
    }

    // Admin Route
    @UseGuards(JwtAuthGuard)
    @Get('admin/conversations')
    async getAllConversations() {
        return this.chatService.getAllConversations();
    }

    @UseGuards(JwtAuthGuard)
    @Delete('admin/conversations/:id')
    async deleteConversation(@Param('id') id: string) {
        return this.chatService.deleteConversation(id);
    }
}
