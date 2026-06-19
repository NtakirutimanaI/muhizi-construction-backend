import {
    Controller,
    Get,
    Patch,
    Delete,
    Param,
    UseGuards,
    Request,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { NotificationService } from './services/notification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) { }

    @Get()
    @ApiOperation({
        summary: 'Get all notifications',
        description: 'Retrieve all notifications for the authenticated user'
    })
    @ApiResponse({
        status: 200,
        description: 'Notifications retrieved successfully',
        schema: {
            example: [
                {
                    id: '770e8400-e29b-41d4-a716-446655440001',
                    type: 'welcome',
                    title: 'Welcome!',
                    message: 'Welcome to the platform!',
                    status: 'sent',
                    isRead: false,
                    createdAt: '2024-01-16T10:30:00.000Z',
                    sentAt: '2024-01-16T10:30:01.000Z'
                }
            ]
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getAll(@Request() req) {
        return this.notificationService.getUserNotifications(req.user.id);
    }

    @Get('unread')
    @ApiOperation({
        summary: 'Get unread notifications',
        description: 'Retrieve only unread notifications for the authenticated user'
    })
    @ApiResponse({ status: 200, description: 'Unread notifications retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async getUnread(@Request() req) {
        return this.notificationService.getUnreadNotifications(req.user.id);
    }

    @Patch(':id/read')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Mark notification as read',
        description: 'Update a specific notification status to read'
    })
    @ApiParam({ name: 'id', description: 'Notification ID (UUID)' })
    @ApiResponse({ status: 200, description: 'Notification marked as read' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Notification not found or does not belong to user' })
    async markAsRead(@Param('id') id: string, @Request() req) {
        return this.notificationService.markAsRead(id, req.user.id);
    }

    @Patch('read-all')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Mark all notifications as read',
        description: 'Update all user notifications to read status'
    })
    @ApiResponse({
        status: 200,
        description: 'All notifications marked as read',
        schema: {
            example: {
                message: 'All notifications marked as read'
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async markAllAsRead(@Request() req) {
        return this.notificationService.markAllAsRead(req.user.id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Delete notification',
        description: 'Delete a specific notification'
    })
    @ApiParam({ name: 'id', description: 'Notification ID (UUID)' })
    @ApiResponse({
        status: 200,
        description: 'Notification deleted successfully',
        schema: {
            example: {
                message: 'Notification deleted successfully'
            }
        }
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 404, description: 'Notification not found or does not belong to user' })
    async delete(@Param('id') id: string, @Request() req) {
        return this.notificationService.deleteNotification(id, req.user.id);
    }
}
