import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { MaterialRequestsService } from './material-requests.service';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';

@ApiTags('Material Requests')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('material-requests')
export class MaterialRequestsController {
    constructor(private readonly service: MaterialRequestsService) { }

    @Post()
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    create(@Body() dto: CreateMaterialRequestDto) {
        return this.service.create(dto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.MANAGER, Role.SITE_MANAGER)
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.MANAGER, Role.SITE_MANAGER)
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.MANAGER, Role.SITE_MANAGER)
    update(@Param('id') id: string, @Body() dto: CreateMaterialRequestDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
