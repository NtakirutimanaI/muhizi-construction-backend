import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
    create(@Body() dto: CreateEmployeeAssignmentDto) {
        return this.service.create(dto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.MANAGER, Role.SITE_MANAGER)
    findAll() {
        return this.service.findAll();
    }

    @Get('employee/:employeeId')
    @Roles(Role.ADMIN, Role.MANAGER, Role.SITE_MANAGER, Role.EMPLOYEE)
    findByEmployee(@Param('employeeId') employeeId: string) {
        return this.service.findByEmployee(employeeId);
    }

    @Get('project/:projectId')
    @Roles(Role.ADMIN, Role.MANAGER, Role.SITE_MANAGER)
    findByProject(@Param('projectId') projectId: string) {
        return this.service.findByProject(projectId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    update(@Param('id') id: string, @Body() dto: UpdateEmployeeAssignmentDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
