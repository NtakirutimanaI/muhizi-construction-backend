import { Controller, Get, Post, Delete, Param, Body, Req, UseGuards } from '@nestjs/common';
import { SharedFilesService } from './shared-files.service';
import { CreateSharedFileDto } from './dto/create-shared-file.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('shared-files')
@UseGuards(JwtAuthGuard)
export class SharedFilesController {
    constructor(private service: SharedFilesService) {}

    @Post()
    create(@Body() dto: CreateSharedFileDto, @Req() req: any) {
        return this.service.create(dto, req.user.id);
    }

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get('my')
    findMine(@Req() req: any) {
        return this.service.findByUser(req.user.id);
    }

    @Get('design/:designId')
    findByDesign(@Param('designId') designId: string) {
        return this.service.findByDesign(designId);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.remove(id);
    }
}
