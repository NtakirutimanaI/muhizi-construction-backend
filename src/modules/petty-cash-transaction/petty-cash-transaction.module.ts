import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PettyCashTransaction } from './entities/petty-cash-transaction.entity';
import { PettyCashFund } from '../petty-cash-fund/entities/petty-cash-fund.entity';
import { PettyCashTransactionController } from './petty-cash-transaction.controller';
import { PettyCashTransactionService } from './petty-cash-transaction.service';

@Module({
    imports: [TypeOrmModule.forFeature([PettyCashTransaction, PettyCashFund])],
    controllers: [PettyCashTransactionController],
    providers: [PettyCashTransactionService],
    exports: [PettyCashTransactionService],
})
export class PettyCashTransactionModule {}
