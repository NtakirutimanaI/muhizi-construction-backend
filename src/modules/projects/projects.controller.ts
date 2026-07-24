import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

const TOGGLE_ROLES = [Role.MANAGING_DIRECTOR, Role.FINANCE_DIRECTOR, Role.SITE_ENGINEER, Role.ENGINEERING_STUDIO, Role.PARTNER];

@ApiTags('Projects')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private readonly service: ProjectsService) { }

    @Post()
    @Roles(Role.ADMIN, ...TOGGLE_ROLES)
    @ApiOperation({ summary: 'Create project', description: 'Creates a new project' })
    @ApiBody({ type: CreateProjectDto })
    @ApiResponse({ status: 201, description: 'Project created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateProjectDto) {
        return this.service.create(dto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.STOREKEEPER, ...TOGGLE_ROLES)
    @ApiOperation({ summary: 'Get all projects', description: 'Retrieves a list of all projects' })
    @ApiResponse({ status: 200, description: 'All projects retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll(@Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.findAll(engineerId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.STOREKEEPER, ...TOGGLE_ROLES)
    @ApiOperation({ summary: 'Get project by ID', description: 'Retrieves a single project by its ID' })
    @ApiResponse({ status: 200, description: 'Project retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string, @Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.findOne(id, engineerId);
    }

    @Put(':id')
    @Roles(Role.ADMIN, ...TOGGLE_ROLES)
    @ApiOperation({ summary: 'Update project', description: 'Updates an existing project by ID' })
    @ApiBody({ type: CreateProjectDto })
    @ApiResponse({ status: 200, description: 'Project updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: CreateProjectDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, ...TOGGLE_ROLES)
    @ApiOperation({ summary: 'Delete project', description: 'Deletes a project by ID' })
    @ApiResponse({ status: 200, description: 'Project deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
