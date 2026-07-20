import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '../auth/enums/role.enum';
import { SiteActivitiesService } from './site-activities.service';
import { CreateSiteActivityDto } from './dto/create-site-activity.dto';

@ApiTags('Site Activities')
@Controller('site-activities')
export class SiteActivitiesController {
    constructor(private readonly service: SiteActivitiesService) { }

    @Post()
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.SITE_ENGINEER)
    @ApiOperation({ summary: 'Create a site activity', description: 'Create a new site activity (admin/site manager/site engineer)' })
    @ApiBody({ type: CreateSiteActivityDto })
    @ApiResponse({ status: 201, description: 'Site activity created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateSiteActivityDto, @Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.create(dto, engineerId);
    }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all site activities', description: 'Retrieve all site activities (public)' })
    @ApiResponse({ status: 200, description: 'All site activities retrieved successfully' })
    findAll() {
        return this.service.findAll();
    }

    @Get('admin')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.SITE_ENGINEER)
    @ApiOperation({ summary: 'Get all site activities (admin)', description: 'Retrieve all site activities with details (admin/site manager/site engineer)' })
    @ApiResponse({ status: 200, description: 'All site activities retrieved successfully (admin)' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAllAdmin(@Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.findAllAdmin(engineerId);
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get site activity by ID', description: 'Retrieve a site activity by its ID (public)' })
    @ApiResponse({ status: 200, description: 'Site activity retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.SITE_ENGINEER)
    @ApiOperation({ summary: 'Update a site activity', description: 'Update an existing site activity (admin/site manager/site engineer)' })
    @ApiBody({ type: CreateSiteActivityDto })
    @ApiResponse({ status: 200, description: 'Site activity updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: CreateSiteActivityDto, @Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.update(id, dto, engineerId);
    }

    @Delete(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a site activity', description: 'Delete a site activity (admin only)' })
    @ApiResponse({ status: 200, description: 'Site activity deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
