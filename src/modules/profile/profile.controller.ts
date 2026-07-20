import {
    Controller,
    Get,
    Put,
    Delete,
    Post,
    Body,
    Param,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
    Ip,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Get current user profile',
        description: 'Retrieve the complete profile of the authenticated user'
    })
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Profile not found' })
    async getProfile(@Request() req) {
        return this.profileService.getProfile(req.user.id);
    }

    @Put()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Update user profile',
        description: 'Update the profile of the authenticated user. All fields are optional.'
    })
    @ApiBody({ type: UpdateProfileDto })
    @ApiResponse({ status: 200, description: 'Profile updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Profile not found' })
    async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
        return this.profileService.updateProfile(req.user.id, updateProfileDto);
    }

    @Delete()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGING_DIRECTOR, Role.FINANCE_DIRECTOR, Role.SITE_ENGINEER, Role.ENGINEERING_STUDIO, Role.PARTNER)
    @ApiBearerAuth('JWT-auth')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Delete user profile',
        description: 'Delete the profile of the authenticated user'
    })
    @ApiResponse({ status: 200, description: 'Profile deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Profile not found' })
    async deleteProfile(@Request() req) {
        return this.profileService.deleteProfile(req.user.id);
    }

    // Public endpoints
    @Public()
    @Get('public')
    @ApiTags('Public')
    @ApiOperation({
        summary: 'Get public company profile',
        description: 'Retrieve the public-facing company profile for the marketing site. No authentication required.'
    })
    @ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Profile not found' })
    async getPublicProfile() {
        return this.profileService.getPublicProfile();
    }

    @Public()
    @Post('contact')
    @ApiTags('Public')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Send contact message',
        description: 'Send a message via the contact form. No authentication required.'
    })
    @ApiBody({ type: SendMessageDto })
    @ApiResponse({ status: 200, description: 'Message sent successfully' })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async sendContactMessage(@Body() sendMessageDto: SendMessageDto, @Ip() ip: string) {
        return this.profileService.sendContactMessage(sendMessageDto, ip);
    }

    // Admin message endpoints
    @Get('messages')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGING_DIRECTOR, Role.FINANCE_DIRECTOR, Role.ENGINEERING_STUDIO, Role.PARTNER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Get all contact messages',
        description: 'Retrieve all contact messages'
    })
    @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getContactMessages(@Request() req) {
        return this.profileService.getContactMessages(req.user.id);
    }

    @Post('messages/:id/read')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.MANAGING_DIRECTOR, Role.FINANCE_DIRECTOR, Role.ENGINEERING_STUDIO, Role.PARTNER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Mark message as read',
        description: 'Update message status to read'
    })
    @ApiParam({ name: 'id', description: 'Message ID' })
    @ApiResponse({ status: 200, description: 'Message marked as read' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Message not found' })
    async markMessageAsRead(@Param('id') id: string) {
        return this.profileService.markMessageAsRead(id);
    }

}
