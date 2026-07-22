import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Site } from '../sites/entities/site.entity';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';

@Module({
    imports: [TypeOrmModule.forFeature([Attendance, Site])],
    controllers: [AttendanceController],
    providers: [AttendanceService],
})
export class AttendanceModule { }
