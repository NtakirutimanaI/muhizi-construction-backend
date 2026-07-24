import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PettyCashFund } from './entities/petty-cash-fund.entity';
import { PettyCashFundController } from './petty-cash-fund.controller';
import { PettyCashFundService } from './petty-cash-fund.service';

@Module({
    imports: [TypeOrmModule.forFeature([PettyCashFund])],
    controllers: [PettyCashFundController],
    providers: [PettyCashFundService],
})
export class PettyCashFundModule {}
