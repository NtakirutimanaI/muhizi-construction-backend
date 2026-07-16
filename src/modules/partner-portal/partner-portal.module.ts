import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PartnerPortalController } from './partner-portal.controller';
import { PartnerPortalService } from './partner-portal.service';
import { Project } from '../projects/entities/project.entity';
import { ProjectEvidence } from '../project-evidence/entities/project-evidence.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Project, ProjectEvidence])],
    controllers: [PartnerPortalController],
    providers: [PartnerPortalService],
    exports: [PartnerPortalService],
})
export class PartnerPortalModule {}
