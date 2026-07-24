import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { PettyCashService } from './petty-cash.service';
import { CreatePettyCashDto } from './dto/create-petty-cash.dto';

@ApiTags('Petty Cash')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('petty-cash')
export class PettyCashController {
    constructor(private readonly service: PettyCashService) {}

    @Post()
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Create petty cash record' })
    @ApiBody({ type: CreatePettyCashDto })
    @ApiResponse({ status: 201, description: 'Record created' })
    create(@Body() dto: CreatePettyCashDto, @Request() req) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.create(dto, user.id, name);
    }

    @Get()
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR, Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Get all petty cash records' })
    @ApiResponse({ status: 200, description: 'List of records' })
    findAll() {
        return this.service.findAll();
    }

    @Get('balance')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR, Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Get petty cash balance' })
    @ApiResponse({ status: 200, description: 'Balance info' })
    getBalance() {
        return this.service.getBalance();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Get petty cash record by ID' })
    @ApiResponse({ status: 200, description: 'Record details' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Update petty cash record' })
    @ApiBody({ type: CreatePettyCashDto })
    @ApiResponse({ status: 200, description: 'Record updated' })
    update(@Param('id') id: string, @Body() dto: Partial<CreatePettyCashDto>) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Delete petty cash record' })
    @ApiResponse({ status: 200, description: 'Record deleted' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
