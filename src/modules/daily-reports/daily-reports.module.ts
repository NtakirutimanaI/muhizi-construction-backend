import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyReport } from './entities/daily-report.entity';
import { DailyReportsController } from './daily-reports.controller';
import { DailyReportsService } from './daily-reports.service';

@Module({
    imports: [TypeOrmModule.forFeature([DailyReport])],
    controllers: [DailyReportsController],
    providers: [DailyReportsService],
})
export class DailyReportsModule {}
