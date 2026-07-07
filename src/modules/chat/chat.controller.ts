import { Controller, Post, Body, Get, Param, UseGuards, Req, Delete } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Public()
    @Post('message')
    @ApiOperation({ summary: 'Send a chat message (public)' })
    async sendMessage(@Body() createMessageDto: CreateMessageDto) {
        return this.chatService.handleUserMessage(createMessageDto);
    }

    @Public()
    @Get('history/:sessionId')
    @ApiOperation({ summary: 'Get chat history by session ID (public)' })
    async getHistory(@Param('sessionId') sessionId: string) {
        return this.chatService.getHistory(sessionId);
    }

    @Get('admin/conversations')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get all conversations (admin)' })
    async getAllConversations() {
        return this.chatService.getAllConversations();
    }

    @Delete('admin/conversations/:id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete a conversation (admin)' })
    async deleteConversation(@Param('id') id: string) {
        return this.chatService.deleteConversation(id);
    }
}
