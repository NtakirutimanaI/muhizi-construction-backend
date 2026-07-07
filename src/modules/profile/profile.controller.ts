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
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { SendAdminMessageDto } from './dto/send-admin-message.dto';
import { RecordVisitDto } from './dto/record-visit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '../auth/enums/role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

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

    @Get('stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get admin dashboard stats' })
    async getStats(@CurrentUser('id') userId: string) {
        return this.profileService.getStats(userId);
    }

    @Get('all')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Get all profiles',
        description: 'Retrieve all user profiles (admin only)'
    })
    @ApiResponse({ status: 200, description: 'Profiles retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getAllProfiles() {
        return this.profileService.getAllProfiles();
    }

    @Put()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.EMPLOYEE)
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
        return this.profileService.updateProfile(
            req.user.id,
            updateProfileDto,
            req.user?.email,
            req.user?.role,
            req.ip,
        );
    }

    @Delete()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
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

    // Public endpoints (no authentication required)
    @Public()
    @Get('public')
    @ApiTags('Public')
    @ApiOperation({
        summary: 'Get public profile',
        description: 'View complete professional portfolio. No authentication required. Perfect for portfolio websites.'
    })
    @ApiQuery({
        name: 'username',
        required: false,
        description: 'Optional username to filter specific profile. If not provided, returns the first profile.',
        example: 'muhizi_construction'
    })
    @ApiResponse({
        status: 200,
        description: 'Public profile retrieved successfully',
        schema: {
            example: {
                id: '660e8400-e29b-41d4-a716-446655440001',
                firstName: 'MUHIZI',
                lastName: 'CONSTRUCTION',
                email: 'info@muhiziconstruction.rw',
                title: 'Real Estate & Construction Company',
                yearsOfExperience: 6,
                bio: 'Leading ICT solutions provider...',
                education: [
                    {
                        degree: 'Custom Web Development',
                        institution: 'Full-Stack Solutions',
                        graduationYear: 2020,
                        description: 'End-to-end web applications built with NestJS, React, and TypeScript.'
                    },
                    {
                        degree: 'Mobile App Development',
                        institution: 'Cross-Platform & Native',
                        graduationYear: 2021,
                        description: 'iOS and Android apps using React Native and Flutter.'
                    },
                    {
                        degree: 'Backend API & Cloud Infrastructure',
                        institution: 'Scalable Architecture',
                        graduationYear: 2022,
                        description: 'RESTful/GraphQL APIs, cloud deployment, and DevOps automation.'
                    },
                    {
                        degree: 'UI/UX Design & Frontend Engineering',
                        institution: 'Pixel-Perfect Interfaces',
                        graduationYear: 2023,
                        description: 'Modern responsive frontends with React, Vue.js, and Tailwind CSS.'
                    }
                ],
                skills: {
                    backend: ['NestJS', 'TypeScript', 'Node.js', 'Laravel', 'PHP'],
                    frontend: ['React', 'JavaScript', 'HTML5', 'CSS3', 'Vue.js'],
                    databases: ['PostgreSQL', 'MongoDB', 'MySQL']
                },
                projects: [],
                servicesOffered: 'Professional ICT services...',
                availableForHire: true
            }
        }
    })
    @ApiResponse({ status: 404, description: 'Profile not found' })
    async getPublicProfile(@Query('username') username?: string) {
        return this.profileService.getPublicProfile(username);
    }

    @Public()
    @Post('contact')
    @ApiTags('Public')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Send contact message',
        description: 'Send a message/service inquiry. No authentication required. Perfect for portfolio contact forms.'
    })
    @ApiBody({ type: SendMessageDto })
    @ApiResponse({
        status: 200,
        description: 'Message sent successfully',
        schema: {
            example: {
                success: true,
                message: 'Your message has been sent successfully! I will get back to you soon.'
            }
        }
    })
    @ApiResponse({ status: 400, description: 'Validation error' })
    async sendContactMessage(@Body() sendMessageDto: SendMessageDto, @Ip() ip: string) {
        return this.profileService.sendContactMessage(sendMessageDto, ip);
    }

    // Admin endpoints
    @Get('messages')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Get all contact messages',
        description: 'Retrieve all contact messages (admin only)'
    })
    @ApiResponse({ status: 200, description: 'Messages retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getContactMessages(@Request() req) {
        return this.profileService.getContactMessages(req.user.id);
    }

    @Post('messages/:id/read')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Mark message as read',
        description: 'Update message status to read (admin only)'
    })
    @ApiParam({ name: 'id', description: 'Message ID' })
    @ApiResponse({ status: 200, description: 'Message marked as read' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Message not found' })
    async markMessageAsRead(@Param('id') id: string) {
        return this.profileService.markMessageAsRead(id);
    }

    @Delete('messages')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({
        summary: 'Delete all messages',
        description: 'Delete all contact messages (admin only)'
    })
    @ApiResponse({ status: 200, description: 'Messages deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async deleteAllMessages(@Request() req) {
        return this.profileService.deleteAllMessages();
    }

    // ───── Message Sub-routes (Inbox / Sent / Trash) ─────

    @Post('messages/send')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Send a message from admin', description: 'Compose and send a message as admin' })
    @ApiBody({ type: SendAdminMessageDto })
    async sendAdminMessage(@Body() dto: SendAdminMessageDto, @Request() req) {
        return this.profileService.sendAdminMessage(dto, req.user.id);
    }

    @Get('messages/inbox')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get inbox messages', description: 'Non-deleted messages from contact form' })
    async getInboxMessages() {
        return this.profileService.getInboxMessages();
    }

    @Get('messages/sent')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get sent messages', description: 'Messages sent by admin users' })
    async getSentMessages() {
        return this.profileService.getSentMessages();
    }

    @Get('messages/trash')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get trashed messages', description: 'Soft-deleted messages' })
    async getTrashMessages() {
        return this.profileService.getTrashMessages();
    }

    @Post('messages/:id/trash')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Move message to trash', description: 'Soft delete a message' })
    async trashMessage(@Param('id') id: string) {
        return this.profileService.trashMessage(id);
    }

    @Post('messages/:id/restore')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Restore message from trash', description: 'Restore a soft-deleted message' })
    async restoreMessage(@Param('id') id: string) {
        return this.profileService.restoreMessage(id);
    }

    @Delete('messages/:id/permanent')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Permanently delete message', description: 'Hard delete a message' })
    async permanentDeleteMessage(@Param('id') id: string) {
        return this.profileService.permanentDeleteMessage(id);
    }

    // ───── Visitor Endpoints ─────

    @Public()
    @Post('visit')
    @ApiTags('Public')
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Record a page visit', description: 'Track visitor on the portfolio. No authentication required.' })
    @ApiBody({ type: RecordVisitDto })
    async recordVisit(@Body() dto: RecordVisitDto, @Ip() ip: string, @Request() req) {
        const userAgent = req.headers['user-agent'] || '';
        return this.profileService.recordVisit(dto, ip, userAgent);
    }

    @Get('visitors')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get all visitors', description: 'Retrieve paginated visitor records (admin only)' })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 20 })
    async getVisitors(@Query('page') page?: number, @Query('limit') limit?: number) {
        return this.profileService.getVisitors(page ? +page : 1, limit ? +limit : 20);
    }

    @Get('visitors/stats')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get visitor statistics', description: 'Get aggregated visitor stats for the admin dashboard' })
    async getVisitorStats() {
        return this.profileService.getVisitorStats();
    }
}
