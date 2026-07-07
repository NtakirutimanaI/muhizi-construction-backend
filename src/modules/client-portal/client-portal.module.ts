import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientPortalController } from './client-portal.controller';
import { ClientPortalService } from './client-portal.service';
import { Project } from '../projects/entities/project.entity';
import { ProjectEvidence } from '../project-evidence/entities/project-evidence.entity';
import { ClientReport } from '../client-reports/entities/client-report.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Project, ProjectEvidence, ClientReport])],
    controllers: [ClientPortalController],
    providers: [ClientPortalService],
    exports: [ClientPortalService],
})
export class ClientPortalModule {}
