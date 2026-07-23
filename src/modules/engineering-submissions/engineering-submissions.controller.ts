import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EngineeringSubmissionsService } from './engineering-submissions.service';
import { CreateEngineeringSubmissionDto } from './dto/create-engineering-submission.dto';
import { UpdateSubmissionStatusDto } from './dto/update-submission-status.dto';

@ApiTags('Engineering Submissions')
@Controller('engineering-submissions')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class EngineeringSubmissionsController {
    constructor(private readonly service: EngineeringSubmissionsService) { }

    @Post()
    @ApiOperation({ summary: 'Submit engineering work' })
    @ApiResponse({ status: 201, description: 'Submission created successfully' })
    async create(@Body() dto: CreateEngineeringSubmissionDto, @Req() req: any) {
        return this.service.create(dto, req.user.id);
    }

    @Get()
    @ApiOperation({ summary: 'List all engineering submissions' })
    @ApiResponse({ status: 200, description: 'List of submissions' })
    async findAll() {
        return this.service.findAll();
    }

    @Get('my')
    @ApiOperation({ summary: 'Get my submissions' })
    @ApiResponse({ status: 200, description: 'List of your submissions' })
    async findMy(@Req() req: any) {
        return this.service.findMySubmissions(req.user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get submission details' })
    @ApiResponse({ status: 200, description: 'Submission details' })
    @ApiResponse({ status: 404, description: 'Submission not found' })
    async findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update submission details' })
    async update(@Param('id') id: string, @Body() dto: CreateEngineeringSubmissionDto) {
        return this.service.update(id, dto);
    }

    @Put(':id/submit-to-admin')
    @ApiOperation({ summary: 'Submit approved work to admin' })
    @ApiResponse({ status: 200, description: 'Submitted to admin successfully' })
    async submitToAdmin(@Param('id') id: string, @Body() body: { notes?: string }) {
        return this.service.submitToAdmin(id, body?.notes);
    }

    @Put(':id/undo-submit-to-admin')
    @ApiOperation({ summary: 'Undo submit to admin' })
    @ApiResponse({ status: 200, description: 'Undo submit to admin successfully' })
    async undoSubmitToAdmin(@Param('id') id: string) {
        return this.service.undoSubmitToAdmin(id);
    }

    @Put(':id/status')
    @ApiOperation({ summary: 'Review submission' })
    @ApiResponse({ status: 200, description: 'Status updated successfully' })
    async updateStatus(@Param('id') id: string, @Body() dto: UpdateSubmissionStatusDto, @Req() req: any) {
        return this.service.updateStatus(id, dto, req.user.id);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete submission' })
    @ApiResponse({ status: 200, description: 'Submission deleted successfully' })
    async remove(@Param('id') id: string) {
        await this.service.remove(id);
        return { message: 'Submission deleted successfully' };
    }
}
