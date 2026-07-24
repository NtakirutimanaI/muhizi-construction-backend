import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PettyCashVoucher } from './entities/petty-cash-voucher.entity';
import { PettyCashVoucherController } from './petty-cash-voucher.controller';
import { PettyCashVoucherService } from './petty-cash-voucher.service';

@Module({
    imports: [TypeOrmModule.forFeature([PettyCashVoucher])],
    controllers: [PettyCashVoucherController],
    providers: [PettyCashVoucherService],
})
export class PettyCashVoucherModule {}
