import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '../auth/enums/role.enum';
import { UpdatesService } from './updates.service';
import { CreateUpdateDto } from './dto/create-update.dto';
import { UpdateUpdateDto } from './dto/update-update.dto';

@ApiTags('Updates')
@Controller('updates')
export class UpdatesController {
    constructor(private readonly service: UpdatesService) {}

    @Public()
    @Get('published')
    @ApiOperation({ summary: 'Get published updates', description: 'Retrieves all published updates visible to the public website and client panel' })
    @ApiResponse({ status: 200, description: 'Published updates retrieved successfully' })
    findPublished() {
        return this.service.findPublished();
    }

    @Public()
    @Get('slug/:slug')
    @ApiOperation({ summary: 'Get update by slug', description: 'Retrieves a single update by its URL slug' })
    @ApiResponse({ status: 200, description: 'Update retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findBySlug(@Param('slug') slug: string) {
        return this.service.findBySlug(slug);
    }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get()
    @ApiOperation({ summary: 'Get all updates', description: 'Retrieves all updates including drafts (admin only)' })
    @ApiResponse({ status: 200, description: 'All updates retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll() {
        return this.service.findAll();
    }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Get(':id')
    @ApiOperation({ summary: 'Get update by ID', description: 'Retrieves a single update by its ID (admin only)' })
    @ApiResponse({ status: 200, description: 'Update retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Post()
    @ApiOperation({ summary: 'Create update', description: 'Creates a new update (admin only). Set isPublished to true to make it visible on the website.' })
    @ApiBody({ type: CreateUpdateDto })
    @ApiResponse({ status: 201, description: 'Update created successfully' })
    @ApiResponse({ status: 400, description: 'Bad request' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateUpdateDto) {
        return this.service.create(dto);
    }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Put(':id')
    @ApiOperation({ summary: 'Update an update', description: 'Updates an existing update by ID (admin only). Setting isPublished to true auto-sets publishedAt.' })
    @ApiBody({ type: UpdateUpdateDto })
    @ApiResponse({ status: 200, description: 'Update updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: UpdateUpdateDto) {
        return this.service.update(id, dto);
    }

    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @Delete(':id')
    @ApiOperation({ summary: 'Delete update', description: 'Deletes an update by ID (admin only)' })
    @ApiResponse({ status: 200, description: 'Update deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
