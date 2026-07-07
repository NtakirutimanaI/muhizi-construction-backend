import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Site } from './entities/site.entity';
import { Project } from '../projects/entities/project.entity';
import { SitesController } from './sites.controller';
import { SitesService } from './sites.service';

@Module({
    imports: [TypeOrmModule.forFeature([Site, Project])],
    controllers: [SitesController],
    providers: [SitesService],
    exports: [SitesService],
})
export class SitesModule { }
