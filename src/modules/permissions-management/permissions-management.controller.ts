import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionsManagementService } from './permissions-management.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Permissions Management')
@Controller('permissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth('JWT-auth')
export class PermissionsManagementController {
    constructor(private readonly service: PermissionsManagementService) {}

    @Get()
    @ApiOperation({ summary: 'Get all permissions' })
    findAll() {
        return this.service.findAll();
    }

    @Get(':role')
    @ApiOperation({ summary: 'Get permissions by role' })
    findByRole(@Param('role') role: string) {
        return this.service.findByRole(role);
    }

    @Put(':role')
    @ApiOperation({ summary: 'Update permissions for a role' })
    updateByRole(@Param('role') role: string, @Body() actions: string[]) {
        return this.service.updateByRole(role, actions);
    }
}
