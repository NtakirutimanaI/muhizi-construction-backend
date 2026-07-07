import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MlService } from './ml.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('ML')
@Controller('ml')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class MlController {
    constructor(private readonly mlService: MlService) { }

    @Post('project-effectiveness')
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Predict project effectiveness score using ML' })
    async predictEffectiveness(@Body() data: any) {
        return this.mlService.predictProjectEffectiveness(data);
    }

    @Post('visitor-trend')
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Forecast visitor trends using ML' })
    async forecastTrend(@Body() data: { historical_counts: number[] }) {
        return this.mlService.forecastVisitorTrend(data.historical_counts);
    }

    @Post('lead-score')
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Score a lead/contact message using ML' })
    async scoreLead(@Body() data: any) {
        return this.mlService.scoreLead(data);
    }

    @Post('classify-message')
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Classify a contact message category using ML' })
    async classifyMessage(@Body() data: { message: string }) {
        return this.mlService.classifyMessage(data.message);
    }

    @Post('validate-email')
    @Roles(Role.ADMIN, Role.SITE_MANAGER)
    @ApiOperation({ summary: 'Validate email quality using ML' })
    async validateEmail(@Body() data: { email: string }) {
        return this.mlService.validateEmail(data.email);
    }
}
