import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { MaterialRequestsService } from './material-requests.service';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';
import { UpdateMaterialRequestStatusDto } from './dto/update-material-request-status.dto';

@ApiTags('Material Requests')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('material-requests')
export class MaterialRequestsController {
    constructor(private readonly service: MaterialRequestsService) { }

    @Post()
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Create material request', description: 'Creates a new material request' })
    @ApiBody({ type: CreateMaterialRequestDto })
    @ApiResponse({ status: 201, description: 'Material request created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateMaterialRequestDto, @Request() req) {
        const user = req.user;
        return this.service.create(dto, user.id, `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email);
    }

    @Get()
    @Roles(Role.ADMIN, Role.MANAGING_DIRECTOR, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Get all material requests', description: 'Retrieves material requests — Admin and Managing Director (reviewers) see all; Site Manager (requester) sees only their own submissions' })
    @ApiResponse({ status: 200, description: 'All material requests retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll(@Request() req) {
        const userId = req.user.role === Role.SITE_MANAGER ? req.user.id : undefined;
        return this.service.findAll(userId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.MANAGING_DIRECTOR, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Get material request by ID', description: 'Retrieves a single material request by its ID' })
    @ApiResponse({ status: 200, description: 'Material request retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string, @Request() req) {
        const userId = req.user.role === Role.SITE_MANAGER ? req.user.id : undefined;
        return this.service.findOne(id, userId);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Update material request', description: 'Updates an existing material request by ID' })
    @ApiBody({ type: CreateMaterialRequestDto })
    @ApiResponse({ status: 200, description: 'Material request updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: CreateMaterialRequestDto) {
        return this.service.update(id, dto);
    }

    @Post(':id/approve')
    @Roles(Role.ADMIN, Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Approve material request', description: 'Approves a material request by ID' })
    @ApiResponse({ status: 200, description: 'Material request approved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    approve(@Param('id') id: string, @Request() req) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.approve(id, user.id, name);
    }

    @Post(':id/reject')
    @Roles(Role.ADMIN, Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Reject material request', description: 'Rejects a material request by ID with notes' })
    @ApiBody({ type: UpdateMaterialRequestStatusDto })
    @ApiResponse({ status: 200, description: 'Material request rejected successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    reject(@Param('id') id: string, @Body() dto: UpdateMaterialRequestStatusDto, @Request() req) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.reject(id, user.id, name, dto.notes);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete material request', description: 'Deletes a material request by ID' })
    @ApiResponse({ status: 200, description: 'Material request deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
