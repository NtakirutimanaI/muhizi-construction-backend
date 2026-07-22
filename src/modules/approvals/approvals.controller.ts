import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApprovalsService } from './approvals.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';

@ApiTags('Approvals')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('approvals')
export class ApprovalsController {
    constructor(private readonly service: ApprovalsService) { }

    @Post()
    @Roles(Role.MANAGING_DIRECTOR, Role.SITE_ENGINEER)
    @ApiOperation({ summary: 'Create approval', description: 'Create a new fund/expense request. Admin is the sole approver and does not submit requests here — Admin records money directly via the Expenses module.' })
    @ApiBody({ type: CreateApprovalDto })
    @ApiResponse({ status: 201, description: 'Approval created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateApprovalDto, @Request() req) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.create(dto, user.id, name);
    }

    @Get()
    @Roles(Role.ADMIN, Role.MANAGING_DIRECTOR, Role.SITE_ENGINEER)
    @ApiOperation({ summary: 'Get all approvals', description: "Retrieve approval requests — Admin (the sole approver) sees all; requesters (Managing Director, Site Engineer) see only their own submissions" })
    @ApiResponse({ status: 200, description: 'All approvals retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll(@Request() req) {
        const requesterId = req.user.role === Role.ADMIN ? undefined : req.user.id;
        return this.service.findAll(requesterId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.MANAGING_DIRECTOR, Role.SITE_ENGINEER)
    @ApiOperation({ summary: 'Get approval by ID', description: 'Retrieve an approval request by ID' })
    @ApiResponse({ status: 200, description: 'Approval retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string, @Request() req) {
        const requesterId = req.user.role === Role.ADMIN ? undefined : req.user.id;
        return this.service.findOne(id, requesterId);
    }

    @Put(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Update approval', description: 'Approve or reject a fund request. Admin-only: Admin is the top of the reporting chain, so it is the sole approver and cannot submit requests to itself.' })
    @ApiBody({ type: UpdateApprovalDto })
    @ApiResponse({ status: 200, description: 'Approval updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: UpdateApprovalDto, @Request() req) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.update(id, dto, user.id, name);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete approval', description: 'Delete an approval request' })
    @ApiResponse({ status: 200, description: 'Approval deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
