import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { Role } from '../auth/enums/role.enum';
import { PayrollService } from './payroll.service';
import { CreatePayrollDto } from './dto/create-payroll.dto';

const TOGGLE_ROLES = [Role.FINANCE_DIRECTOR];

@ApiTags('Payroll')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payroll')
export class PayrollController {
    constructor(private readonly service: PayrollService) { }

    @Post()
    @Roles(Role.ADMIN, Role.SITE_MANAGER, ...TOGGLE_ROLES)
    @RequirePermissions('payroll:create')
    @ApiOperation({ summary: 'Create payroll record', description: 'Creates a new payroll record' })
    @ApiBody({ type: CreatePayrollDto })
    @ApiResponse({ status: 201, description: 'Payroll record created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreatePayrollDto) {
        return this.service.create(dto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, ...TOGGLE_ROLES)
    @RequirePermissions('payroll:read')
    @ApiOperation({ summary: 'Get all payroll records', description: 'Retrieves a list of all payroll records' })
    @ApiResponse({ status: 200, description: 'All payroll records retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll() {
        return this.service.findAll();
    }

    @Get('period')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, ...TOGGLE_ROLES)
    @RequirePermissions('payroll:read')
    @ApiOperation({ summary: 'Get payroll by period', description: 'Retrieves payroll records for a given month and year' })
    @ApiResponse({ status: 200, description: 'Payroll records retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findByPeriod(@Query('month') month: number, @Query('year') year: number) {
        return this.service.findByPeriod(month, year);
    }

    @Get('employee/:employeeId')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, Role.EMPLOYEE)
    @ApiOperation({ summary: 'Get payroll by employee', description: 'Retrieves payroll records for a specific employee — self-service, not permission-gated' })
    @ApiResponse({ status: 200, description: 'Payroll records retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findByEmployee(@Param('employeeId') employeeId: string) {
        return this.service.findByEmployee(employeeId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, ...TOGGLE_ROLES)
    @RequirePermissions('payroll:read')
    @ApiOperation({ summary: 'Get payroll record by ID', description: 'Retrieves a single payroll record by its ID' })
    @ApiResponse({ status: 200, description: 'Payroll record retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, ...TOGGLE_ROLES)
    @RequirePermissions('payroll:update')
    @ApiOperation({ summary: 'Update payroll record', description: 'Updates an existing payroll record by ID' })
    @ApiBody({ type: CreatePayrollDto })
    @ApiResponse({ status: 200, description: 'Payroll record updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: CreatePayrollDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete payroll record', description: 'Deletes a payroll record by ID' })
    @ApiResponse({ status: 200, description: 'Payroll record deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
