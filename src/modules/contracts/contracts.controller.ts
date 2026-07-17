import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';

@ApiTags('Contracts')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('contracts')
export class ContractsController {
    constructor(private readonly service: ContractsService) { }

    @Post()
    @Roles(Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Create contract', description: 'Create a new contract. Admin does not manage contracts directly — it sees them as a read-only report scoped to an employee.' })
    @ApiBody({ type: CreateContractDto })
    @ApiResponse({ status: 201, description: 'Contract created successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    create(@Body() dto: CreateContractDto) {
        return this.service.create(dto);
    }

    @Get()
    @Roles(Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Get all contracts', description: 'Retrieve all contracts' })
    @ApiResponse({ status: 200, description: 'All contracts retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findAll() {
        return this.service.findAll();
    }

    @Get('employee/:employeeId')
    @Roles(Role.ADMIN, Role.MANAGING_DIRECTOR, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Get contracts by employee', description: 'Retrieve contracts for a specific employee — the read-only report Admin sees on an employee\'s profile' })
    @ApiResponse({ status: 200, description: 'Employee contracts retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    findByEmployee(@Param('employeeId') employeeId: string) {
        return this.service.findByEmployee(employeeId);
    }

    @Get(':id')
    @Roles(Role.ADMIN, Role.MANAGING_DIRECTOR, Role.FINANCE_DIRECTOR)
    @ApiOperation({ summary: 'Get contract by ID', description: 'Retrieve a contract by ID' })
    @ApiResponse({ status: 200, description: 'Contract retrieved successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    findOne(@Param('id') id: string) {
        return this.service.findOne(id);
    }

    @Put(':id')
    @Roles(Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Update contract', description: 'Update an existing contract' })
    @ApiBody({ type: CreateContractDto })
    @ApiResponse({ status: 200, description: 'Contract updated successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    update(@Param('id') id: string, @Body() dto: CreateContractDto) {
        return this.service.update(id, dto);
    }

    @Delete(':id')
    @Roles(Role.MANAGING_DIRECTOR)
    @ApiOperation({ summary: 'Delete contract', description: 'Delete a contract' })
    @ApiResponse({ status: 200, description: 'Contract deleted successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
