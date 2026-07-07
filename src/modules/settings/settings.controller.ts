import { Controller, Get, Put, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { CreateSettingDto, UpdateSettingDto } from './dto/create-setting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Settings')
@Controller('settings')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class SettingsController {
    constructor(private readonly service: SettingsService) {}

    @Get()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get all system settings' })
    findAll(@Query('category') category?: string) {
        return this.service.findAll(category);
    }

    @Get(':key')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Get setting by key' })
    findByKey(@Param('key') key: string) {
        return this.service.findByKey(key);
    }

    @Post()
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Create a system setting' })
    create(@Body() dto: CreateSettingDto) {
        return this.service.create(dto);
    }

    @Put(':key')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Update a system setting' })
    update(@Param('key') key: string, @Body() dto: UpdateSettingDto) {
        return this.service.update(key, dto);
    }

    @Post('backup')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Trigger system backup' })
    backup() {
        return this.service.backup();
    }

    @Post('restore')
    @Roles(Role.ADMIN)
    @ApiOperation({ summary: 'Restore system from backup data' })
    restore(@Body() data: any[]) {
        return this.service.restore(data);
    }
}
