import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';

@ApiTags('Expenses')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('expenses')
export class ExpensesController {
    constructor(private readonly service: ExpensesService) { }

    @Post()
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Create expense', description: 'Create a new expense' })
    @ApiBody({ type: CreateExpenseDto })
    @ApiResponse({ status: 201, description: 'Expense created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateExpenseDto) {
        return this.service.create(dto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER)
    @ApiOperation({ summary: 'Get all expenses', description: 'Retrieve all expenses' })
    @ApiResponse({ status: 200, description: 'All expenses retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll() {
        return this.service.findAll();
    }

    @Get('total')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER)
    @ApiOperation({ summary: 'Get total expenses', description: 'Retrieve the total amount of expenses' })
    @ApiResponse({ status: 200, description: 'Total expenses retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async total() {
        const total = await this.service.getTotal();
        return { total };
    }

    @Get('range')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER)
    @ApiOperation({ summary: 'Get expenses by date range', description: 'Retrieve expenses filtered by date range' })
    @ApiResponse({ status: 200, description: 'Expenses retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findByDateRange(@Query('start') start: string, @Query('end') end: string) {
        return this.service.findByDateRange(start, end);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER)
    @ApiOperation({ summary: 'Get expense by ID', description: 'Retrieve an expense by ID' })
    @ApiResponse({ status: 200, description: 'Expense retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Update expense', description: 'Update an existing expense' })
    @ApiBody({ type: CreateExpenseDto })
    @ApiResponse({ status: 200, description: 'Expense updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: CreateExpenseDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete expense', description: 'Delete an expense' })
    @ApiResponse({ status: 200, description: 'Expense deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
