import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { SendUpdateDto } from './dto/send-update.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Subscribers')
@Controller('subscribers')
export class SubscribersController {
    constructor(private readonly service: SubscribersService) {}

    @Post()
    @ApiOperation({ summary: 'Subscribe to newsletter (public)' })
    async subscribe(@Body() dto: CreateSubscriberDto) {
        return this.service.subscribe(dto);
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get all subscribers (admin)' })
    async findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Get subscriber by id (admin)' })
    async findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Update subscriber (admin)' })
    async update(@Param('id') id: string, @Body() dto: UpdateSubscriberDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Delete subscriber (admin)' })
    async remove(@Param('id') id: string) {
        await this.service.remove(id);
        return { message: 'Subscriber deleted' };
    }

    @Post('send-update')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.ADMIN)
    @ApiBearerAuth('JWT-auth')
    @ApiOperation({ summary: 'Send email update to all active subscribers' })
    async sendUpdate(@Body() dto: SendUpdateDto) {
        return this.service.sendUpdate(dto);
    }
}
