import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalaryRatesController } from './salary-rates.controller';
import { SalaryRatesService } from './salary-rates.service';
import { SalaryRate } from './entities/salary-rate.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SalaryRate])],
    controllers: [SalaryRatesController],
    providers: [SalaryRatesService],
    exports: [SalaryRatesService],
})
export class SalaryRatesModule {}
