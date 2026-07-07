import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/create-income.dto';

@ApiTags('Incomes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('incomes')
export class IncomesController {
    constructor(private readonly service: IncomesService) { }

    @Post()
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Create income', description: 'Create a new income record' })
    @ApiBody({ type: CreateIncomeDto })
    @ApiResponse({ status: 201, description: 'Income created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateIncomeDto) {
        return this.service.create(dto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER)
    @ApiOperation({ summary: 'Get all incomes', description: 'Retrieve all income records' })
    @ApiResponse({ status: 200, description: 'All incomes retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll() {
        return this.service.findAll();
    }

    @Get('total')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER)
    @ApiOperation({ summary: 'Get total incomes', description: 'Retrieve the total amount of incomes' })
    @ApiResponse({ status: 200, description: 'Total incomes retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    async total() {
        const total = await this.service.getTotal();
        return { total };
    }

    @Get('range')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER)
    @ApiOperation({ summary: 'Get incomes by date range', description: 'Retrieve incomes filtered by date range' })
    @ApiResponse({ status: 200, description: 'Incomes retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findByDateRange(@Query('start') start: string, @Query('end') end: string) {
        return this.service.findByDateRange(start, end);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER)
    @ApiOperation({ summary: 'Get income by ID', description: 'Retrieve an income record by ID' })
    @ApiResponse({ status: 200, description: 'Income retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Update income', description: 'Update an existing income record' })
    @ApiBody({ type: CreateIncomeDto })
    @ApiResponse({ status: 200, description: 'Income updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: CreateIncomeDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete income', description: 'Delete an income record' })
    @ApiResponse({ status: 200, description: 'Income deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
