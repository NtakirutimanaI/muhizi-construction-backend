import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { PartnershipsService } from './partnerships.service';
import { CreatePartnershipDto } from './dto/create-partnership.dto';

@ApiTags('Partnerships')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('partnerships')
export class PartnershipsController {
    constructor(private readonly service: PartnershipsService) { }

    @Post()
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Create partnership', description: 'Create a new partnership' })
    @ApiBody({ type: CreatePartnershipDto })
    @ApiResponse({ status: 201, description: 'Partnership created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreatePartnershipDto) {
        return this.service.create(dto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, Role.EMPLOYEE)
    @ApiOperation({ summary: 'Get all partnerships', description: 'Retrieve all partnerships' })
    @ApiResponse({ status: 200, description: 'All partnerships retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, Role.EMPLOYEE)
    @ApiOperation({ summary: 'Get partnership by ID', description: 'Retrieve a partnership by ID' })
    @ApiResponse({ status: 200, description: 'Partnership retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Update partnership', description: 'Update an existing partnership. Moving status out of "pending" records the reviewer automatically.' })
    @ApiBody({ type: CreatePartnershipDto })
    @ApiResponse({ status: 200, description: 'Partnership updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: CreatePartnershipDto, @Request() req) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.update(id, dto, user.id, name);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete partnership', description: 'Delete a partnership' })
    @ApiResponse({ status: 200, description: 'Partnership deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
