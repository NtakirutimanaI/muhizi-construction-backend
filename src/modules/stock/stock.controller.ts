import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@ApiTags('Stock')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('stock')
export class StockController {
    constructor(private readonly service: StockService) { }

    @Post()
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.FINANCE_DIRECTOR, Role.MANAGER)
    @ApiOperation({ summary: 'Create stock entry', description: 'Creates a new stock entry' })
    @ApiBody({ type: CreateStockDto })
    @ApiResponse({ status: 201, description: 'Stock entry created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateStockDto, @Request() req) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.create(dto, user.id, name);
    }

    @Get()
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, Role.FINANCE_DIRECTOR, Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Get all stock entries', description: 'Retrieves a list of all stock entries' })
    @ApiResponse({ status: 200, description: 'All stock entries retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll() {
        return this.service.findAll();
    }

    @Get('stats')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, Role.FINANCE_DIRECTOR, Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Get stock stats', description: 'Retrieves stock statistics' })
    @ApiResponse({ status: 200, description: 'Stock stats retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    getStats() {
        return this.service.getStats();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, Role.FINANCE_DIRECTOR, Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Get stock entry by ID', description: 'Retrieves a single stock entry by its ID' })
    @ApiResponse({ status: 200, description: 'Stock entry retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.FINANCE_DIRECTOR, Role.MANAGER)
    @ApiOperation({ summary: 'Update stock entry', description: 'Updates an existing stock entry by ID' })
    @ApiBody({ type: UpdateStockDto })
    @ApiResponse({ status: 200, description: 'Stock entry updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: UpdateStockDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete stock entry', description: 'Deletes a stock entry by ID' })
    @ApiResponse({ status: 200, description: 'Stock entry deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
