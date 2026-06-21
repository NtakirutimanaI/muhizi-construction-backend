import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ApprovalsService } from './approvals.service';
import { CreateApprovalDto } from './dto/create-approval.dto';
import { UpdateApprovalDto } from './dto/update-approval.dto';

@ApiTags('Approvals')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('approvals')
export class ApprovalsController {
    constructor(private readonly service: ApprovalsService) { }

    @Post()
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    create(@Body() dto: CreateApprovalDto) {
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
    @Roles(Role.ADMIN, Role.MANAGER)
    update(@Param('id') id: string, @Body() dto: UpdateApprovalDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
