import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { InsuranceService } from './insurance.service';
import { CreateInsuranceSettingDto } from './dto/create-insurance-setting.dto';

@ApiTags('Insurance')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('insurance')
export class InsuranceController {
    constructor(private readonly service: InsuranceService) {}

    @Get()
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Get all insurance settings' })
    findAll() {
        return this.service.findAll();
    }

    @Get('active')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR, Role.SITE_ENGINEER)
    @ApiOperation({ summary: 'Get active insurance settings' })
    findActive() {
        return this.service.findActive();
    }

    @Get('deduction')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Get total employee deduction amount' })
    async getDeduction() {
        const total = await this.service.getTotalDeduction();
        return { totalDeduction: total };
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Get insurance setting by ID' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Post()
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Create insurance setting' })
    create(@Body() dto: CreateInsuranceSettingDto) {
        return this.service.create(dto);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Update insurance setting' })
    update(@Param('id') id: string, @Body() dto: Partial<CreateInsuranceSettingDto>) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Delete insurance setting' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
