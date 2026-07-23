import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EngineeringSubmission } from './entities/engineering-submission.entity';
import { Task } from '../tasks/entities/task.entity';
import { User } from '../auth/entities/user.entity';
import { EngineeringSubmissionsController } from './engineering-submissions.controller';
import { EngineeringSubmissionsService } from './engineering-submissions.service';

@Module({
    imports: [TypeOrmModule.forFeature([EngineeringSubmission, Task, User])],
    controllers: [EngineeringSubmissionsController],
    providers: [EngineeringSubmissionsService],
    exports: [EngineeringSubmissionsService],
})
export class EngineeringSubmissionsModule { }
