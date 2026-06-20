import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Audit')
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get audit logs (admin only)' })
    async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
        return this.auditService.findAll(page ? +page : 1, limit ? +limit : 50);
    }

    @Get('stats')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get audit statistics (admin only)' })
    async getStats() {
        return this.auditService.getStats();
    }

    @Get('user')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get audit logs by user (admin only)' })
    async findByUser(@Query('userId') userId: string, @Query('page') page?: number, @Query('limit') limit?: number) {
        return this.auditService.findByUser(userId, page ? +page : 1, limit ? +limit : 20);
    }
}
