import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Resources')
@Controller('resources')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ResourcesController {
    constructor(private readonly service: ResourcesService) { }

    @Post()
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Create a resource' })
    create(@Body() dto: CreateResourceDto) {
        return this.service.create(dto);
    }

    @Get()
    @Roles(Role.ADMIN, Role.SITE_MANAGER, Role.MANAGER, Role.EMPLOYEE)
    @ApiOperation({ summary: 'Get all resources' })
    findAll() {
        return this.service.findAll();
    }

    @Put(':id')
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Update a resource' })
    update(@Param('id') id: string, @Body() dto: CreateResourceDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Delete a resource' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
