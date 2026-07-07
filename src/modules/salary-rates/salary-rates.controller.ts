import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SalaryRatesService } from './salary-rates.service';
import { CreateSalaryRateDto, UpdateSalaryRateDto } from './dto/create-salary-rate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Salary Rates')
@Controller('salary-rates')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
@ApiBearerAuth('JWT-auth')
export class SalaryRatesController {
    constructor(private readonly service: SalaryRatesService) {}

    @Get()
    @ApiOperation({ summary: 'List all salary rates' })
    findAll() {
        return this.service.findAll();
    }

    @Get('employee/:employeeId')
    @ApiOperation({ summary: 'Get salary history for an employee' })
    findByEmployee(@Param('employeeId') employeeId: string) {
        return this.service.findByEmployee(employeeId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get salary rate by id' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Create a salary rate' })
    create(@Body() dto: CreateSalaryRateDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a salary rate' })
    update(@Param('id') id: string, @Body() dto: UpdateSalaryRateDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a salary rate' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
