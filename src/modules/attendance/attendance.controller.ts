import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@ApiTags('Attendance')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attendance')
export class AttendanceController {
    constructor(private readonly service: AttendanceService) { }

    @Post()
    @Roles(Role.ADMIN, Role.STOREKEEPER, Role.SITE_ENGINEER, Role.ENGINEERING_STUDIO)
    @ApiOperation({ summary: 'Create attendance', description: 'Create a new attendance record' })
    @ApiBody({ type: CreateAttendanceDto })
    @ApiResponse({ status: 201, description: 'Attendance record created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateAttendanceDto, @Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.create(dto, engineerId);
    }

    @Get()
    @Roles(Role.ADMIN, Role.STOREKEEPER, Role.SITE_ENGINEER, Role.ENGINEERING_STUDIO)
    @ApiOperation({ summary: 'Get all attendance', description: 'Retrieve all attendance records' })
    @ApiResponse({ status: 200, description: 'All attendance records retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll(@Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.findAll(engineerId);
    }

    @Get('stats')
    @Roles(Role.ADMIN, Role.STOREKEEPER, Role.STOREKEEPER, Role.SITE_ENGINEER, Role.ENGINEERING_STUDIO)
    @ApiOperation({ summary: 'Get attendance stats', description: 'Retrieve attendance statistics' })
    @ApiResponse({ status: 200, description: 'Attendance stats retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    stats(@Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.getStats(engineerId);
    }

    @Get('range')
    @Roles(Role.ADMIN, Role.STOREKEEPER, Role.STOREKEEPER, Role.SITE_ENGINEER, Role.ENGINEERING_STUDIO)
    @ApiOperation({ summary: 'Get attendance by date range', description: 'Retrieve attendance records filtered by date range' })
    @ApiResponse({ status: 200, description: 'Attendance records retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findByDateRange(@Query('start') start: string, @Query('end') end: string, @Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.findByDateRange(start, end, engineerId);
    }

    @Get('employee/:employeeId')
    @Roles(Role.ADMIN, Role.STOREKEEPER)
    @ApiOperation({ summary: 'Get attendance by employee', description: 'Retrieve attendance records for a specific employee' })
    @ApiResponse({ status: 200, description: 'Attendance records retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findByEmployee(@Param('employeeId') employeeId: string) {
        return this.service.findByEmployee(employeeId);
    }

    @Get('employee/:employeeId/month')
    @Roles(Role.ADMIN, Role.STOREKEEPER)
    @ApiOperation({ summary: 'Get attendance by employee and month', description: 'Retrieve attendance records for a specific employee in a given month' })
    @ApiResponse({ status: 200, description: 'Attendance records retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findByEmployeeInMonth(
        @Param('employeeId') employeeId: string,
        @Query('year') year: number,
        @Query('month') month: number,
    ) {
        return this.service.findByEmployeeInMonth(employeeId, year, month);
    }

    @Get('project/:projectId')
    @Roles(Role.ADMIN, Role.STOREKEEPER, Role.STOREKEEPER, Role.SITE_ENGINEER, Role.ENGINEERING_STUDIO)
    @ApiOperation({ summary: 'Get attendance by project', description: 'Retrieve attendance records for a specific project' })
    @ApiResponse({ status: 200, description: 'Attendance records retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findByProject(@Param('projectId') projectId: string, @Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.findByProject(projectId, engineerId);
    }

    @Get('site/:site')
    @Roles(Role.ADMIN, Role.STOREKEEPER, Role.STOREKEEPER, Role.SITE_ENGINEER, Role.ENGINEERING_STUDIO)
    @ApiOperation({ summary: 'Get attendance by site', description: 'Retrieve attendance records for a specific site' })
    @ApiResponse({ status: 200, description: 'Attendance records retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findBySite(@Param('site') site: string, @Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.findBySite(site, engineerId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.STOREKEEPER, Role.SITE_ENGINEER, Role.ENGINEERING_STUDIO)
    @ApiOperation({ summary: 'Get attendance by ID', description: 'Retrieve an attendance record by ID' })
    @ApiResponse({ status: 200, description: 'Attendance record retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string, @Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.findOne(id, engineerId);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.STOREKEEPER, Role.SITE_ENGINEER, Role.ENGINEERING_STUDIO)
    @ApiOperation({ summary: 'Update attendance', description: 'Update an existing attendance record' })
    @ApiBody({ type: CreateAttendanceDto })
    @ApiResponse({ status: 200, description: 'Attendance record updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: CreateAttendanceDto, @Request() req) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.update(id, dto, engineerId);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete attendance', description: 'Delete an attendance record' })
    @ApiResponse({ status: 200, description: 'Attendance record deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
