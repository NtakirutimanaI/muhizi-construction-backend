import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { DesignsService } from './designs.service';
import { CreateDesignDto } from './dto/create-design.dto';

const TOGGLE_ROLES = [Role.MANAGING_DIRECTOR, Role.FINANCE_DIRECTOR, Role.SITE_ENGINEER, Role.ENGINEERING_STUDIO, Role.PARTNER];

@ApiTags('Designs')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('designs')
export class DesignsController {
    constructor(private readonly service: DesignsService) { }

    @Post()
    @Roles(Role.ADMIN, Role.SITE_MANAGER, ...TOGGLE_ROLES)
    @ApiOperation({ summary: 'Create design', description: 'Create a new design' })
    @ApiBody({ type: CreateDesignDto })
    @ApiResponse({ status: 201, description: 'Design created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateDesignDto) {
        return this.service.create(dto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, Role.EMPLOYEE, ...TOGGLE_ROLES)
    @ApiOperation({ summary: 'Get all designs', description: 'Retrieve all designs' })
    @ApiResponse({ status: 200, description: 'All designs retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, Role.EMPLOYEE, ...TOGGLE_ROLES)
    @ApiOperation({ summary: 'Get design by ID', description: 'Retrieve a design by ID' })
    @ApiResponse({ status: 200, description: 'Design retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, ...TOGGLE_ROLES)
    @ApiOperation({ summary: 'Update design', description: 'Update an existing design' })
    @ApiBody({ type: CreateDesignDto })
    @ApiResponse({ status: 200, description: 'Design updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: CreateDesignDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, ...TOGGLE_ROLES)
    @ApiOperation({ summary: 'Delete design', description: 'Delete a design' })
    @ApiResponse({ status: 200, description: 'Design deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
