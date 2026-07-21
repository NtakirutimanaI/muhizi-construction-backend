import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@ApiTags('Employees')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('employees')
export class EmployeesController {
    constructor(private readonly service: EmployeesService) { }

    @Post()
    @Roles(Role.STOREKEEPER, Role.SITE_ENGINEER)
    @ApiOperation({ summary: 'Create employee', description: 'Creates a new employee record. Registration is an HR/field function, not Admin\'s — Admin views the registry read-only.' })
    @ApiBody({ type: CreateEmployeeDto })
    @ApiResponse({ status: 201, description: 'Employee created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateEmployeeDto) {
        return this.service.create(dto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.STOREKEEPER, Role.STOREKEEPER, Role.EMPLOYEE)
    @ApiOperation({ summary: 'Get all employees', description: 'Retrieves a list of all employees' })
    @ApiResponse({ status: 200, description: 'All employees retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.STOREKEEPER, Role.STOREKEEPER, Role.EMPLOYEE)
    @ApiOperation({ summary: 'Get employee by ID', description: 'Retrieves a single employee by its ID' })
    @ApiResponse({ status: 200, description: 'Employee retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.STOREKEEPER, Role.SITE_ENGINEER)
    @ApiOperation({ summary: 'Update employee', description: 'Updates an existing employee by ID' })
    @ApiBody({ type: CreateEmployeeDto })
    @ApiResponse({ status: 200, description: 'Employee updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: CreateEmployeeDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.STOREKEEPER, Role.SITE_ENGINEER)
    @ApiOperation({ summary: 'Delete employee', description: 'Deletes an employee by ID' })
    @ApiResponse({ status: 200, description: 'Employee deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
