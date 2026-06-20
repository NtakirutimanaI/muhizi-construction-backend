import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
    constructor(private readonly service: ReportsService) { }

    @Get('monthly/:year/:month')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER)
    monthly(@Param('year') year: number, @Param('month') month: number) {
        return this.service.getMonthlyReport(year, month);
    }

    @Get('yearly/:year')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER)
    yearly(@Param('year') year: number) {
        return this.service.getYearlyReport(year);
    }
}
