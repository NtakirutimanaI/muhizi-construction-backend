import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { MaterialRequestsService } from './material-requests.service';
import { CreateMaterialRequestDto } from './dto/create-material-request.dto';
import { UpdateMaterialRequestStatusDto } from './dto/update-material-request-status.dto';

@ApiTags('Material Requests')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('material-requests')
export class MaterialRequestsController {
    constructor(private readonly service: MaterialRequestsService) { }

    @Post()
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    create(@Body() dto: CreateMaterialRequestDto, @Request() req) {
        const user = req.user;
        return this.service.create(dto, user.id, `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email);
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
    @Roles(Role.ADMIN, Role.MANAGER)
    update(@Param('id') id: string, @Body() dto: CreateMaterialRequestDto) {
        return this.service.update(id, dto);
    }

    @Post(':id/approve')
    @Roles(Role.ADMIN, Role.MANAGER)
    approve(@Param('id') id: string, @Request() req) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.approve(id, user.id, name);
    }

    @Post(':id/reject')
    @Roles(Role.ADMIN, Role.MANAGER)
    reject(@Param('id') id: string, @Body() dto: UpdateMaterialRequestStatusDto, @Request() req) {
        const user = req.user;
        const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
        return this.service.reject(id, user.id, name, dto.notes);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
