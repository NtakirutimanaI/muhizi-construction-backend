import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Role } from '../auth/enums/role.enum';
import { SiteRulesService } from './site-rules.service';
import { CreateSiteRuleDto } from './dto/create-site-rule.dto';

@ApiTags('Site Rules')
@Controller('site-rules')
export class SiteRulesController {
    constructor(private readonly service: SiteRulesService) { }

    @Post()
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.STOREKEEPER)
    @ApiOperation({ summary: 'Create a site rule', description: 'Create a new site rule (admin/site engineer)' })
    @ApiBody({ type: CreateSiteRuleDto })
    @ApiResponse({ status: 201, description: 'Site rule created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateSiteRuleDto) {
        return this.service.create(dto);
    }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Get all site rules', description: 'Retrieve all site rules (public)' })
    @ApiResponse({ status: 200, description: 'All site rules retrieved successfully' })
    findAll() {
        return this.service.findAll();
    }

    @Get('admin')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.STOREKEEPER)
    @ApiOperation({ summary: 'Get all site rules (admin)', description: 'Retrieve all site rules with details (admin/site engineer)' })
    @ApiResponse({ status: 200, description: 'All site rules retrieved successfully (admin)' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAllAdmin() {
        return this.service.findAllAdmin();
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Get site rule by ID', description: 'Retrieve a site rule by its ID (public)' })
    @ApiResponse({ status: 200, description: 'Site rule retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN, Role.STOREKEEPER)
    @ApiOperation({ summary: 'Update a site rule', description: 'Update an existing site rule (admin/site engineer)' })
    @ApiBody({ type: CreateSiteRuleDto })
    @ApiResponse({ status: 200, description: 'Site rule updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: CreateSiteRuleDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a site rule', description: 'Delete a site rule (admin only)' })
    @ApiResponse({ status: 200, description: 'Site rule deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
