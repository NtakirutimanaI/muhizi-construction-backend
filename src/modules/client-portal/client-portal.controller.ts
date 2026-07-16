import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ClientPortalService } from './client-portal.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Client Portal')
@Controller('client')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CLIENT)
@ApiBearerAuth('JWT-auth')
export class ClientPortalController {
    constructor(private readonly service: ClientPortalService) {}

    @Get('projects')
    @ApiOperation({ summary: 'Get my projects', description: 'Returns only the projects linked to the authenticated client' })
    getProjects(@Request() req) {
        return this.service.getProjects(req.user.id);
    }

    @Get('projects/:id/progress')
    @ApiOperation({ summary: 'Get project progress details' })
    getProjectProgress(@Param('id') id: string, @Request() req) {
        return this.service.getProjectProgress(id, req.user.id);
    }

    @Get('projects/:id/evidence')
    @ApiOperation({ summary: 'Get project evidence' })
    getProjectEvidence(@Param('id') id: string, @Request() req) {
        return this.service.getProjectEvidence(id, req.user.id);
    }

    @Get('reports')
    @ApiOperation({ summary: 'Get published client reports', description: 'Returns only reports for projects linked to the authenticated client' })
    getReports(@Request() req) {
        return this.service.getReports(req.user.id);
    }
}
