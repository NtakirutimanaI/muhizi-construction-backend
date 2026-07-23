import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { EditTaskDto } from './dto/edit-task.dto';

@ApiTags('Tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class TasksController {
    constructor(private readonly service: TasksService) {}

    @Post()
    @UseGuards(RolesGuard)
    @Roles(Role.MANAGING_DIRECTOR, Role.ADMIN)
    @ApiOperation({ summary: 'Create and assign a task' })
    async create(@Body() dto: CreateTaskDto, @Req() req: any) {
        const userName = `${req.user.profile?.firstName || ''} ${req.user.profile?.lastName || ''}`.trim() || req.user.email;
        return this.service.create(dto, req.user.id, userName);
    }

    @Get()
    @ApiOperation({ summary: 'Get all tasks' })
    async findAll() {
        return this.service.findAll();
    }

    @Get('my')
    @ApiOperation({ summary: 'Get my assigned tasks' })
    async findMy(@Req() req: any) {
        return this.service.findMyTasks(req.user.id);
    }

    @Get('team-members')
    @ApiOperation({ summary: 'Get engineering studio team members' })
    async getTeamMembers() {
        return this.service.findEngineeringStudioMembers();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get task by ID' })
    async findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.MANAGING_DIRECTOR, Role.ADMIN)
    @ApiOperation({ summary: 'Update task details' })
    async update(@Param('id') id: string, @Body() dto: EditTaskDto) {
        return this.service.update(id, dto);
    }

    @Put(':id/status')
    @ApiOperation({ summary: 'Update task status' })
    async updateStatus(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
        return this.service.updateStatus(id, dto);
    }

    @Delete('clear-all')
    @UseGuards(RolesGuard)
    @Roles(Role.MANAGING_DIRECTOR, Role.ADMIN)
    @ApiOperation({ summary: 'Clear all tasks' })
    async clearAll() {
        return this.service.clearAll();
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles(Role.MANAGING_DIRECTOR, Role.ADMIN)
    @ApiOperation({ summary: 'Delete a task' })
    async remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
