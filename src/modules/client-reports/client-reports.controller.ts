import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientReportsService } from './client-reports.service';
import { CreateClientReportDto, UpdateClientReportDto } from './dto/create-client-report.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Client Reports')
@Controller('client-reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGING_DIRECTOR)
@ApiBearerAuth('JWT-auth')
export class ClientReportsController {
    constructor(private readonly service: ClientReportsService) {}

    @Get()
    @ApiOperation({ summary: 'List all client reports' })
    findAll(@Query('status') status?: string) {
        return this.service.findAll(status);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get client report by id' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a client report' })
    create(@Body() dto: CreateClientReportDto, @Request() req) {
        return this.service.create(dto, req.user.id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a client report' })
    update(@Param('id') id: string, @Body() dto: UpdateClientReportDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a client report' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
