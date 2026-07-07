import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientReportsController } from './client-reports.controller';
import { ClientReportsService } from './client-reports.service';
import { ClientReport } from './entities/client-report.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ClientReport])],
    controllers: [ClientReportsController],
    providers: [ClientReportsService],
    exports: [ClientReportsService],
})
export class ClientReportsModule {}
