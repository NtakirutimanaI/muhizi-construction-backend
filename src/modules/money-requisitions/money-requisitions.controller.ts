import { Controller, Get, Post, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { MoneyRequisitionsService } from './money-requisitions.service';
import { CreateMoneyRequisitionDto } from './dto/create-money-requisition.dto';
import { ReviewMoneyRequisitionDto } from './dto/review-money-requisition.dto';

@ApiTags('Money Requisitions')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('money-requisitions')
export class MoneyRequisitionsController {
    constructor(private readonly service: MoneyRequisitionsService) {}

    @Post()
    @Roles(Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Create money requisition', description: 'Finance Director requests money from admin' })
    @ApiBody({ type: CreateMoneyRequisitionDto })
    @ApiResponse({ status: 201, description: 'Requisition created' })
    create(@Body() dto: CreateMoneyRequisitionDto, @Request() req) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.create(dto, user.id, name);
    }

    @Get()
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Get all money requisitions' })
    @ApiResponse({ status: 200, description: 'List of requisitions' })
    findAll(@Request() req) {
        const user = req.user;
        if (user.role === 'finance_director') {
            return this.service.findAllByRequester(user.id);
        }
        return this.service.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Get money requisition by ID' })
    @ApiResponse({ status: 200, description: 'Requisition details' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Post(':id/review')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Review money requisition', description: 'Admin approves, rejects, or modifies and submits back' })
    @ApiBody({ type: ReviewMoneyRequisitionDto })
    @ApiResponse({ status: 200, description: 'Requisition reviewed' })
    @ApiResponse({ status: 400, description: 'Already reviewed' })
    review(@Param('id') id: string, @Body() dto: ReviewMoneyRequisitionDto, @Request() req) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.review(id, dto, user.id, name);
    }

    @Delete(':id')
    @Roles(Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Delete money requisition' })
    @ApiResponse({ status: 200, description: 'Requisition deleted' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
