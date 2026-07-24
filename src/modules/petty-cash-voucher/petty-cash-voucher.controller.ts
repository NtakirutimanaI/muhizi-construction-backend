import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { PettyCashVoucherService } from './petty-cash-voucher.service';
import { CreatePettyCashVoucherDto } from './dto/create-petty-cash-voucher.dto';

@ApiTags('Petty Cash Voucher')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('petty-cash-vouchers')
export class PettyCashVoucherController {
    constructor(private readonly service: PettyCashVoucherService) {}

    @Post()
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR, Role.EMPLOYEE, Role.SITE_ENGINEER, Role.STOREKEEPER)
    @ApiOperation({ summary: 'Create petty cash voucher' })
    @ApiBody({ type: CreatePettyCashVoucherDto })
    @ApiResponse({ status: 201, description: 'Voucher created' })
    create(@Body() dto: CreatePettyCashVoucherDto, @Request() req) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.create(dto, user.id, name);
    }

    @Get()
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR, Role.MANAGING_DIRECTOR, Role.EMPLOYEE)
    @ApiOperation({ summary: 'Get all petty cash vouchers' })
    @ApiResponse({ status: 200, description: 'List of vouchers' })
    findAll() {
        return this.service.findAll();
    }

    @Get('stats')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR, Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Get voucher statistics' })
    @ApiResponse({ status: 200, description: 'Voucher stats' })
    getStats() {
        return this.service.getStats();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR, Role.EMPLOYEE, Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Get petty cash voucher by ID' })
    @ApiResponse({ status: 200, description: 'Voucher details' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR, Role.EMPLOYEE)
    @ApiOperation({ summary: 'Update petty cash voucher' })
    @ApiBody({ type: CreatePettyCashVoucherDto })
    @ApiResponse({ status: 200, description: 'Voucher updated' })
    update(@Param('id') id: string, @Body() dto: Partial<CreatePettyCashVoucherDto>, @Request() req) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.update(id, dto, user.id, name);
    }

    @Post(':id/submit')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR, Role.EMPLOYEE, Role.SITE_ENGINEER, Role.STOREKEEPER)
    @ApiOperation({ summary: 'Submit voucher for approval' })
    @ApiResponse({ status: 200, description: 'Voucher submitted' })
    submit(@Param('id') id: string) {
        return this.service.submit(id);
    }

    @Post(':id/approve')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Approve pending voucher' })
    @ApiResponse({ status: 200, description: 'Voucher approved' })
    approve(@Param('id') id: string, @Request() req) {
        const name = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
        return this.service.approve(id, name);
    }

    @Post(':id/reject')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Reject pending voucher' })
    @ApiResponse({ status: 200, description: 'Voucher rejected' })
    reject(@Param('id') id: string, @Request() req, @Body() body: { reason?: string }) {
        const name = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
        return this.service.reject(id, name, body.reason);
    }

    @Post(':id/pay')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Mark voucher as paid' })
    @ApiResponse({ status: 200, description: 'Voucher marked as paid' })
    markPaid(@Param('id') id: string, @Request() req, @Body() body: { notes?: string }) {
        const name = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
        return this.service.markPaid(id, name, body.notes);
    }

    @Post(':id/close')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Close paid voucher' })
    @ApiResponse({ status: 200, description: 'Voucher closed' })
    close(@Param('id') id: string) {
        return this.service.close(id);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Delete petty cash voucher' })
    @ApiResponse({ status: 200, description: 'Voucher deleted' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
