import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Partnership } from './entities/partnership.entity';
import { PartnershipsController } from './partnerships.controller';
import { PartnershipsService } from './partnerships.service';

@Module({
    imports: [TypeOrmModule.forFeature([Partnership])],
    controllers: [PartnershipsController],
    providers: [PartnershipsService],
})
export class PartnershipsModule { }
