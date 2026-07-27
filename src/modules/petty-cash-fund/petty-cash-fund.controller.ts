import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { PettyCashFundService } from './petty-cash-fund.service';
import { CreatePettyCashFundDto } from './dto/create-petty-cash-fund.dto';

@ApiTags('Petty Cash Fund')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('petty-cash-funds')
export class PettyCashFundController {
    constructor(private readonly service: PettyCashFundService) {}

    @Post()
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR, Role.EMPLOYEE, Role.STOREKEEPER)
    @ApiOperation({ summary: 'Create petty cash fund' })
    @ApiBody({ type: CreatePettyCashFundDto })
    @ApiResponse({ status: 201, description: 'Fund created' })
    create(@Body() dto: CreatePettyCashFundDto, @Request() req) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.create(dto, user.id, name);
    }

    @Get()
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR, Role.EMPLOYEE, Role.STOREKEEPER)
    @ApiOperation({ summary: 'Get all petty cash funds' })
    @ApiResponse({ status: 200, description: 'List of funds' })
    findAll() {
        return this.service.findAll();
    }

    @Get('stats')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Get fund statistics' })
    @ApiResponse({ status: 200, description: 'Fund stats' })
    getStats() {
        return this.service.getStats();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR, Role.EMPLOYEE, Role.STOREKEEPER)
    @ApiOperation({ summary: 'Get petty cash fund by ID' })
    @ApiResponse({ status: 200, description: 'Fund details' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Update petty cash fund' })
    @ApiBody({ type: CreatePettyCashFundDto })
    @ApiResponse({ status: 200, description: 'Fund updated' })
    update(@Param('id') id: string, @Body() dto: Partial<CreatePettyCashFundDto>, @Request() req) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.update(id, dto, user.id, name);
    }

    @Post(':id/replenish')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Replenish petty cash fund' })
    @ApiBody({ schema: { properties: { amount: { type: 'number', example: 100000 }, description: { type: 'string', example: 'Monthly top-up' } } } })
    @ApiResponse({ status: 200, description: 'Fund replenished' })
    replenish(@Param('id') id: string, @Body() body: { amount: number; description?: string }) {
        return this.service.replenish(id, body.amount, body.description);
    }

    @Post(':id/adjust')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Adjust petty cash fund balance' })
    @ApiBody({ schema: { properties: { amount: { type: 'number', example: -5000, description: 'Positive to increase, negative to decrease' }, description: { type: 'string', example: 'Correction of over-counted cash' } } } })
    @ApiResponse({ status: 200, description: 'Fund adjusted' })
    adjust(@Param('id') id: string, @Body() body: { amount: number; description?: string }) {
        return this.service.adjust(id, body.amount, body.description);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Delete petty cash fund' })
    @ApiResponse({ status: 200, description: 'Fund deleted' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
