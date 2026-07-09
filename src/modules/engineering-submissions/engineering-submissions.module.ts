import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngineeringSubmission } from './entities/engineering-submission.entity';
import { EngineeringSubmissionsController } from './engineering-submissions.controller';
import { EngineeringSubmissionsService } from './engineering-submissions.service';

@Module({
    imports: [TypeOrmModule.forFeature([EngineeringSubmission])],
    controllers: [EngineeringSubmissionsController],
    providers: [EngineeringSubmissionsService],
    exports: [EngineeringSubmissionsService],
})
export class EngineeringSubmissionsModule { }
