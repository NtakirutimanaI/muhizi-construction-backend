import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { EmployeeAssignmentsService } from './employee-assignments.service';
import { CreateEmployeeAssignmentDto } from './dto/create-employee-assignment.dto';
import { UpdateEmployeeAssignmentDto } from './dto/update-employee-assignment.dto';

@ApiTags('Employee Assignments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employee-assignments')
export class EmployeeAssignmentsController {
    constructor(private readonly service: EmployeeAssignmentsService) { }

    @Post()
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Create employee assignment', description: 'Create a new employee assignment' })
    @ApiBody({ type: CreateEmployeeAssignmentDto })
    @ApiResponse({ status: 201, description: 'Employee assignment created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateEmployeeAssignmentDto) {
        return this.service.create(dto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.MANAGER, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Get all employee assignments', description: 'Retrieve all employee assignments' })
    @ApiResponse({ status: 200, description: 'All employee assignments retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll() {
        return this.service.findAll();
    }

    @Get('my-team')
    @Roles(Role.SITE_MANAGER, Role.MANAGER)
    @ApiOperation({ summary: 'Get my team assignments', description: 'Retrieve assignments for the current user\'s team' })
    @ApiResponse({ status: 200, description: 'Team assignments retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findMyTeam(@Req() req: any) {
        return this.service.findMyTeam(req.user.email);
    }

    @Get('employee/:employeeId')
    @Roles(Role.ADMIN, Role.MANAGER, Role.SITE_MANAGER, Role.EMPLOYEE)
    @ApiOperation({ summary: 'Get assignments by employee', description: 'Retrieve employee assignments for a specific employee' })
    @ApiResponse({ status: 200, description: 'Employee assignments retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findByEmployee(@Param('employeeId') employeeId: string) {
        return this.service.findByEmployee(employeeId);
    }

    @Get('project/:projectId')
    @Roles(Role.ADMIN, Role.MANAGER, Role.SITE_MANAGER, Role.SITE_ENGINEER, Role.ENGINEERING_STUDIO)
    @ApiOperation({ summary: 'Get assignments by project', description: 'Retrieve employee assignments for a specific project' })
    @ApiResponse({ status: 200, description: 'Employee assignments retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findByProject(@Param('projectId') projectId: string, @Req() req: any) {
        const engineerId = req.user.role === Role.SITE_ENGINEER ? req.user.id : undefined;
        return this.service.findByProject(projectId, engineerId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Get employee assignment by ID', description: 'Retrieve an employee assignment by ID' })
    @ApiResponse({ status: 200, description: 'Employee assignment retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    @ApiOperation({ summary: 'Update employee assignment', description: 'Update an existing employee assignment' })
    @ApiBody({ type: UpdateEmployeeAssignmentDto })
    @ApiResponse({ status: 200, description: 'Employee assignment updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: UpdateEmployeeAssignmentDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete employee assignment', description: 'Delete an employee assignment' })
    @ApiResponse({ status: 200, description: 'Employee assignment deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
