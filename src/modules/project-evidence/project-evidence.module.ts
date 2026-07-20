import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEvidence } from './entities/project-evidence.entity';
import { Site } from '../sites/entities/site.entity';
import { ProjectEvidenceController } from './project-evidence.controller';
import { ProjectEvidenceService } from './project-evidence.service';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectEvidence, Site])],
    controllers: [ProjectEvidenceController],
    providers: [ProjectEvidenceService],
})
export class ProjectEvidenceModule {}
