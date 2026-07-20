import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ReportsService } from './reports.service';

const TOGGLE_ROLES = [Role.FINANCE_DIRECTOR];
const READ_ROLES = [Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, Role.MANAGING_DIRECTOR, ...TOGGLE_ROLES];

@ApiTags('Reports')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
    constructor(private readonly service: ReportsService) { }

    @Get('monthly/:year/:month')
    @Roles(...READ_ROLES)
    @ApiOperation({ summary: 'Get monthly report', description: 'Retrieves the monthly report for given year and month' })
    @ApiResponse({ status: 200, description: 'Monthly report retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    monthly(@Param('year') year: number, @Param('month') month: number) {
        return this.service.getMonthlyReport(year, month);
    }

    @Get('yearly/:year')
    @Roles(...READ_ROLES)
    @ApiOperation({ summary: 'Get yearly report', description: 'Retrieves the yearly report for the given year' })
    @ApiResponse({ status: 200, description: 'Yearly report retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    yearly(@Param('year') year: number) {
        return this.service.getYearlyReport(year);
    }
}
