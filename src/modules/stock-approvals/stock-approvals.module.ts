import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockApprovalsController } from './stock-approvals.controller';
import { StockApprovalsService } from './stock-approvals.service';
import { StockApproval } from './entities/stock-approval.entity';

@Module({
    imports: [TypeOrmModule.forFeature([StockApproval])],
    controllers: [StockApprovalsController],
    providers: [StockApprovalsService],
    exports: [StockApprovalsService],
})
export class StockApprovalsModule {}
