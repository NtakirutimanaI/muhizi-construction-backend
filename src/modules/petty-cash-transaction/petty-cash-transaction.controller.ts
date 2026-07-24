import { Controller, Get, Post, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { PettyCashTransactionService } from './petty-cash-transaction.service';
import { CreatePettyCashTransactionDto } from './dto/create-petty-cash-transaction.dto';

@ApiTags('Petty Cash Transaction')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('petty-cash-transactions')
export class PettyCashTransactionController {
    constructor(private readonly service: PettyCashTransactionService) {}

    @Post()
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR, Role.SITE_ENGINEER, Role.STOREKEEPER)
    @ApiOperation({ summary: 'Create petty cash transaction' })
    @ApiBody({ type: CreatePettyCashTransactionDto })
    @ApiResponse({ status: 201, description: 'Transaction created' })
    create(@Body() dto: CreatePettyCashTransactionDto, @Request() req) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.create(dto, user.id, name);
    }

    @Get()
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR, Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Get all petty cash transactions' })
    @ApiQuery({ name: 'fundId', required: false, description: 'Filter by fund ID' })
    @ApiResponse({ status: 200, description: 'List of transactions' })
    findAll(@Query('fundId') fundId?: string) {
        return this.service.findAll(fundId);
    }

    @Get('fund/:fundId')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR, Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Get transactions by fund' })
    @ApiResponse({ status: 200, description: 'List of transactions for a fund' })
    findByFund(@Param('fundId') fundId: string) {
        return this.service.findByFund(fundId);
    }

    @Get('stats')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR, Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Get transaction statistics' })
    @ApiResponse({ status: 200, description: 'Transaction stats' })
    getStats() {
        return this.service.getStats();
    }
}
