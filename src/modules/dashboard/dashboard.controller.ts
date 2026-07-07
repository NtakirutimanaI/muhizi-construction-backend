import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class DashboardController {
    constructor(private readonly service: DashboardService) {}

    @Get('admin')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Admin dashboard KPIs' })
    getAdminKpi() {
        return this.service.getAdminKpi();
    }

    @Get('managing-director')
    @Roles(Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Managing Director dashboard KPIs' })
    getManagingDirectorKpi() {
        return this.service.getManagingDirectorKpi();
    }

    @Get('finance-director')
    @Roles(Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Finance Director dashboard KPIs' })
    getFinanceDirectorKpi() {
        return this.service.getFinanceDirectorKpi();
    }

    @Get('site-engineer')
    @Roles(Role.SITE_ENGINEER)
    @ApiOperation({ summary: 'Site Engineer dashboard KPIs' })
    getSiteEngineerKpi(@Request() req) {
        return this.service.getSiteEngineerKpi(req.user.id);
    }

    @Get('engineering-studio')
    @Roles(Role.ENGINEERING_STUDIO)
    @ApiOperation({ summary: 'Engineering Studio dashboard KPIs' })
    getEngineeringStudioKpi() {
        return this.service.getEngineeringStudioKpi();
    }

    @Get('client')
    @Roles(Role.CLIENT)
    @ApiOperation({ summary: 'Client dashboard KPIs' })
    getClientKpi() {
        return this.service.getClientKpi();
    }
}
