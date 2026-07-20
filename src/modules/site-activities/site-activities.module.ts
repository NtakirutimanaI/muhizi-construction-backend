import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SiteActivity } from './entities/site-activity.entity';
import { Site } from '../sites/entities/site.entity';
import { SiteActivitiesController } from './site-activities.controller';
import { SiteActivitiesService } from './site-activities.service';

@Module({
    imports: [TypeOrmModule.forFeature([SiteActivity, Site])],
    controllers: [SiteActivitiesController],
    providers: [SiteActivitiesService],
})
export class SiteActivitiesModule {}
