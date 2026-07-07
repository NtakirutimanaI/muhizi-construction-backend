import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StockApprovalsService } from './stock-approvals.service';
import { CreateStockApprovalDto, UpdateStockApprovalDto } from './dto/create-stock-approval.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Stock Approvals')
@Controller('stock-approvals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.FINANCE_DIRECTOR, Role.MANAGING_DIRECTOR)
@ApiBearerAuth('JWT-auth')
export class StockApprovalsController {
    constructor(private readonly service: StockApprovalsService) {}

    @Get()
    @ApiOperation({ summary: 'List all stock approvals' })
    findAll(@Query('status') status?: string) {
        return this.service.findAll(status);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get stock approval by id' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a stock approval request' })
    create(@Body() dto: CreateStockApprovalDto, @Request() req) {
        return this.service.create(dto, req.user.id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update stock approval (approve/reject)' })
    update(@Param('id') id: string, @Body() dto: UpdateStockApprovalDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a stock approval' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
