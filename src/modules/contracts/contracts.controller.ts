import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';

@ApiTags('Contracts')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('contracts')
export class ContractsController {
    constructor(private readonly service: ContractsService) { }

    @Post()
    @Roles(Role.ADMIN, Role.MANAGER)
    create(@Body() dto: CreateContractDto) {
        return this.service.create(dto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.MANAGER)
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.MANAGER)
    update(@Param('id') id: string, @Body() dto: CreateContractDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
