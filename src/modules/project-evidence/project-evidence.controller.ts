import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ProjectEvidenceService } from './project-evidence.service';
import { CreateProjectEvidenceDto } from './dto/create-project-evidence.dto';
import { UpdateProjectEvidenceDto } from './dto/update-project-evidence.dto';

@ApiTags('Project Evidence')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('project-evidence')
export class ProjectEvidenceController {
    constructor(private readonly service: ProjectEvidenceService) { }

    @Post()
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.SITE_ENGINEER)
    @ApiOperation({ summary: 'Create project evidence', description: 'Creates a new project evidence record' })
    @ApiBody({ type: CreateProjectEvidenceDto })
    @ApiResponse({ status: 201, description: 'Project evidence created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateProjectEvidenceDto, @Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.create(dto, engineerId);
    }

    @Get()
    @Roles(Role.ADMIN, Role.MANAGER, Role.SITE_MANAGER, Role.PARTNER, Role.CLIENT, Role.SITE_ENGINEER)
    @ApiOperation({ summary: 'Get all project evidence', description: 'Retrieves a list of all project evidence' })
    @ApiResponse({ status: 200, description: 'All project evidence retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll(@Query('clientVisible') clientVisible: string | undefined, @Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.findAll(clientVisible === 'true', engineerId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.MANAGER, Role.SITE_MANAGER, Role.CLIENT, Role.SITE_ENGINEER)
    @ApiOperation({ summary: 'Get project evidence by ID', description: 'Retrieves a single project evidence record by its ID' })
    @ApiResponse({ status: 200, description: 'Project evidence retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string, @Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.findOne(id, engineerId);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.SITE_ENGINEER)
    @ApiOperation({ summary: 'Update project evidence', description: 'Updates an existing project evidence record by ID (partial update supported)' })
    @ApiBody({ type: UpdateProjectEvidenceDto })
    @ApiResponse({ status: 200, description: 'Project evidence updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: UpdateProjectEvidenceDto, @Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.update(id, dto, engineerId);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete project evidence', description: 'Deletes a project evidence record by ID' })
    @ApiResponse({ status: 200, description: 'Project evidence deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
