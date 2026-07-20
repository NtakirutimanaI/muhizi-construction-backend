import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { SitesService } from './sites.service';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSiteDto } from './dto/update-site.dto';

@ApiTags('Sites')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('sites')
export class SitesController {
    constructor(private readonly service: SitesService) { }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Create site', description: 'Creates a new site' })
    @ApiBody({ type: CreateSiteDto })
    @ApiResponse({ status: 201, description: 'Site created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateSiteDto) {
        return this.service.create(dto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, Role.EMPLOYEE, Role.CLIENT, Role.MANAGING_DIRECTOR, Role.SITE_ENGINEER, Role.FINANCE_DIRECTOR, Role.ENGINEERING_STUDIO, Role.PARTNER)
    @ApiOperation({ summary: 'Get all sites', description: 'Retrieves a list of all sites' })
    @ApiResponse({ status: 200, description: 'All sites retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll(@Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.findAll(engineerId);
    }

    @Get('project/:projectId')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, Role.EMPLOYEE, Role.CLIENT, Role.MANAGING_DIRECTOR, Role.SITE_ENGINEER, Role.FINANCE_DIRECTOR, Role.ENGINEERING_STUDIO, Role.PARTNER)
    @ApiOperation({ summary: 'Get sites by project', description: 'Retrieves all sites for a given project' })
    @ApiResponse({ status: 200, description: 'Sites retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findByProject(@Param('projectId') projectId: string, @Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.findByProject(projectId, engineerId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, Role.EMPLOYEE, Role.CLIENT, Role.MANAGING_DIRECTOR, Role.SITE_ENGINEER, Role.FINANCE_DIRECTOR, Role.ENGINEERING_STUDIO, Role.PARTNER)
    @ApiOperation({ summary: 'Get site by ID', description: 'Retrieves a single site by its ID' })
    @ApiResponse({ status: 200, description: 'Site retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string, @Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.findOne(id, engineerId);
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Update site', description: 'Updates an existing site by ID' })
    @ApiBody({ type: UpdateSiteDto })
    @ApiResponse({ status: 200, description: 'Site updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: UpdateSiteDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete site', description: 'Deletes a site by ID' })
    @ApiResponse({ status: 200, description: 'Site deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
