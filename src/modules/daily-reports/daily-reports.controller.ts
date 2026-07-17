import { Controller, Get, Post, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { DailyReportsService } from './daily-reports.service';
import { CreateDailyReportDto } from './dto/create-daily-report.dto';

@ApiTags('Daily Reports')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('daily-reports')
export class DailyReportsController {
    constructor(private readonly service: DailyReportsService) { }

    @Post()
    @Roles(Role.MANAGING_DIRECTOR, Role.ADMIN)
    @ApiOperation({ summary: 'Submit daily operations report', description: 'Managing Director submits a summary of the day\'s site, stock, and request activity' })
    @ApiResponse({ status: 201, description: 'Report submitted successfully' })
    create(@Body() dto: CreateDailyReportDto, @Req() req: any) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.create(dto, user.id, name);
    }

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get all daily reports', description: 'Admin reads all submitted daily operations reports' })
    @ApiResponse({ status: 200, description: 'All reports retrieved successfully' })
    findAll() {
        return this.service.findAll();
    }

    @Get('my')
    @Roles(Role.MANAGING_DIRECTOR, Role.ADMIN)
    @ApiOperation({ summary: 'Get my daily reports', description: 'Managing Director views their own submission history' })
    @ApiResponse({ status: 200, description: 'Reports retrieved successfully' })
    findMy(@Req() req: any) {
        return this.service.findMy(req.user.id);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete daily report', description: 'Admin deletes a daily report' })
    @ApiResponse({ status: 200, description: 'Report deleted successfully' })
    async remove(@Param('id') id: string) {
        await this.service.remove(id);
        return { message: 'Daily report deleted successfully' };
    }
}
