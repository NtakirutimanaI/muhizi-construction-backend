import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { EngineeringSubmissionsService } from './engineering-submissions.service';
import { CreateEngineeringSubmissionDto } from './dto/create-engineering-submission.dto';
import { UpdateSubmissionStatusDto } from './dto/update-submission-status.dto';

@ApiTags('Engineering Submissions')
@Controller('engineering-submissions')
export class EngineeringSubmissionsController {
    constructor(private readonly service: EngineeringSubmissionsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ENGINEERING_STUDIO, Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Submit engineering work', description: 'Engineering studio submits a design report, drawing, or other engineering work for review' })
    @ApiResponse({ status: 201, description: 'Submission created successfully' })
    async create(@Body() dto: CreateEngineeringSubmissionDto, @Req() req: any) {
        const userId = req.user.id;
        return this.service.create(dto, userId);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.MANAGING_DIRECTOR, Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'List all engineering submissions', description: 'View all submissions (managing director and admin only)' })
    @ApiResponse({ status: 200, description: 'List of submissions' })
    async findAll() {
        return this.service.findAll();
    }

    @Get('my')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ENGINEERING_STUDIO, Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get my submissions', description: 'Engineering studio views their own submissions' })
    @ApiResponse({ status: 200, description: 'List of your submissions' })
    async findMy(@Req() req: any) {
        return this.service.findMySubmissions(req.user.id);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ENGINEERING_STUDIO, Role.MANAGING_DIRECTOR, Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get submission details' })
    @ApiResponse({ status: 200, description: 'Submission details' })
    @ApiResponse({ status: 404, description: 'Submission not found' })
    async findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.MANAGING_DIRECTOR, Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Review submission', description: 'Managing director or admin approves, rejects, or marks as reviewed' })
    @ApiResponse({ status: 200, description: 'Status updated successfully' })
    async updateStatus(@Param('id') id: string, @Body() dto: UpdateSubmissionStatusDto, @Req() req: any) {
        return this.service.updateStatus(id, dto, req.user.id);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete submission', description: 'Admin deletes a submission' })
    @ApiResponse({ status: 200, description: 'Submission deleted successfully' })
    async remove(@Param('id') id: string) {
        await this.service.remove(id);
        return { message: 'Submission deleted successfully' };
    }
}
