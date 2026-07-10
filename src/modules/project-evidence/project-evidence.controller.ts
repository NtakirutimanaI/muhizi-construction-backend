import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ProjectEvidenceService } from './project-evidence.service';
import { CreateProjectEvidenceDto } from './dto/create-project-evidence.dto';

@ApiTags('Project Evidence')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('project-evidence')
export class ProjectEvidenceController {
    constructor(private readonly service: ProjectEvidenceService) { }

    @Post()
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Create project evidence', description: 'Creates a new project evidence record' })
    @ApiBody({ type: CreateProjectEvidenceDto })
    @ApiResponse({ status: 201, description: 'Project evidence created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateProjectEvidenceDto) {
        return this.service.create(dto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.MANAGER, Role.SITE_MANAGER, Role.PARTNER)
    @ApiOperation({ summary: 'Get all project evidence', description: 'Retrieves a list of all project evidence' })
    @ApiResponse({ status: 200, description: 'All project evidence retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll(@Query('clientVisible') clientVisible?: string) {
        return this.service.findAll(clientVisible === 'true');
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.MANAGER, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Get project evidence by ID', description: 'Retrieves a single project evidence record by its ID' })
    @ApiResponse({ status: 200, description: 'Project evidence retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Update project evidence', description: 'Updates an existing project evidence record by ID' })
    @ApiBody({ type: CreateProjectEvidenceDto })
    @ApiResponse({ status: 200, description: 'Project evidence updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: CreateProjectEvidenceDto) {
        return this.service.update(id, dto);
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
