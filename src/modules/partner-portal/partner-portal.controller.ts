import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PartnerPortalService } from './partner-portal.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Partner Portal')
@Controller('partner')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.PARTNER)
@ApiBearerAuth('JWT-auth')
export class PartnerPortalController {
    constructor(private readonly service: PartnerPortalService) {}

    @Get('projects')
    @ApiOperation({ summary: 'Get my projects' })
    getProjects() {
        return this.service.getProjects();
    }

    @Get('projects/:id/progress')
    @ApiOperation({ summary: 'Get project progress details' })
    getProjectProgress(@Param('id') id: string) {
        return this.service.getProjectProgress(id);
    }

    @Get('projects/:id/evidence')
    @ApiOperation({ summary: 'Get project evidence' })
    getProjectEvidence(@Param('id') id: string) {
        return this.service.getProjectEvidence(id);
    }

    @Get('reports')
    @ApiOperation({ summary: 'Get published partner reports' })
    getReports() {
        return this.service.getReports();
    }
}
