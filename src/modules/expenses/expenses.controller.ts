import { Controller, Get, Post, Put, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

const TOGGLE_ROLES = [Role.FINANCE_DIRECTOR];
const READ_ROLES = [Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, Role.MANAGING_DIRECTOR, ...TOGGLE_ROLES];

@ApiTags('Expenses')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('expenses')
export class ExpensesController {
    constructor(private readonly service: ExpensesService) { }

    @Post()
    @Roles(Role.ADMIN, Role.SITE_MANAGER, ...TOGGLE_ROLES)
    @ApiOperation({ summary: 'Create expense', description: 'Create a new expense' })
    @ApiBody({ type: CreateExpenseDto })
    @ApiResponse({ status: 201, description: 'Expense created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateExpenseDto, @Request() req) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.create(dto, user.id, name);
    }

    @Get()
    @Roles(...READ_ROLES)
    @ApiOperation({ summary: 'Get all expenses', description: 'Retrieve all expenses' })
    @ApiResponse({ status: 200, description: 'All expenses retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll() {
        return this.service.findAll();
    }

    @Get('total')
    @Roles(...READ_ROLES)
    @ApiOperation({ summary: 'Get total expenses', description: 'Retrieve the total amount of expenses' })
    @ApiResponse({ status: 200, description: 'Total expenses retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async total() {
        const total = await this.service.getTotal();
        return { total };
    }

    @Get('range')
    @Roles(...READ_ROLES)
    @ApiOperation({ summary: 'Get expenses by date range', description: 'Retrieve expenses filtered by date range' })
    @ApiResponse({ status: 200, description: 'Expenses retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findByDateRange(@Query('start') start: string, @Query('end') end: string) {
        return this.service.findByDateRange(start, end);
    }

    @Get(':id')
    @Roles(...READ_ROLES)
    @ApiOperation({ summary: 'Get expense by ID', description: 'Retrieve an expense by ID' })
    @ApiResponse({ status: 200, description: 'Expense retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, ...TOGGLE_ROLES)
    @ApiOperation({ summary: 'Update expense', description: 'Update an existing expense' })
    @ApiBody({ type: CreateExpenseDto })
    @ApiResponse({ status: 200, description: 'Expense updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: CreateExpenseDto) {
        return this.service.update(id, dto);
    }

    // Financial records are not hard-deletable — the audit trail depends on every
    // recorded expense staying on file. Mistakes get fixed via update, not removed.
}
