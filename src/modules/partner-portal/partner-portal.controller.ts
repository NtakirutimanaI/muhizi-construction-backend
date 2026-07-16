import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PartnerPortalService } from './partner-portal.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Partner Portal')
@Controller('partner-portal')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PARTNER)
@ApiBearerAuth('JWT-auth')
export class PartnerPortalController {
    constructor(private readonly service: PartnerPortalService) {}

    @Get('projects')
    @ApiOperation({ summary: 'Get my projects', description: 'Returns only the projects linked to the authenticated partner' })
    getProjects(@Request() req) {
        return this.service.getProjects(req.user.id);
    }

    @Get('projects/:id/evidence')
    @ApiOperation({ summary: 'Get project evidence' })
    getProjectEvidence(@Param('id') id: string, @Request() req) {
        return this.service.getProjectEvidence(id, req.user.id);
    }
}
