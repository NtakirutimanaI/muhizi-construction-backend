import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { IncomesService } from './incomes.service';
import { CreateIncomeDto } from './dto/create-income.dto';

@ApiTags('Incomes')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('incomes')
export class IncomesController {
    constructor(private readonly service: IncomesService) { }

    @Post()
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    create(@Body() dto: CreateIncomeDto) {
        return this.service.create(dto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER)
    findAll() {
        return this.service.findAll();
    }

    @Get('total')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER)
    async total() {
        const total = await this.service.getTotal();
        return { total };
    }

    @Get('range')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER)
    findByDateRange(@Query('start') start: string, @Query('end') end: string) {
        return this.service.findByDateRange(start, end);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER)
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    update(@Param('id') id: string, @Body() dto: CreateIncomeDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
