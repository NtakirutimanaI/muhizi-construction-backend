import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DesignReviewsService } from './design-reviews.service';
import { CreateDesignReviewDto, UpdateDesignReviewDto } from './dto/create-design-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Design Reviews')
@Controller('design-reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGING_DIRECTOR, Role.SITE_ENGINEER)
@ApiBearerAuth('JWT-auth')
export class DesignReviewsController {
    constructor(private readonly service: DesignReviewsService) {}

    @Get()
    @ApiOperation({ summary: 'List all design reviews' })
    findAll() {
        return this.service.findAll();
    }

    @Get('design/:designId')
    @ApiOperation({ summary: 'Get reviews for a design' })
    findByDesign(@Param('designId') designId: string) {
        return this.service.findByDesign(designId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get design review by id' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Post()
    @ApiOperation({ summary: 'Submit a design for review' })
    create(@Body() dto: CreateDesignReviewDto, @Request() req) {
        return this.service.create(dto, req.user.id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update design review (approve/reject)' })
    update(@Param('id') id: string, @Body() dto: UpdateDesignReviewDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a design review' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
