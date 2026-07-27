import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoneyRequisition } from './entities/money-requisition.entity';
import { MoneyRequisitionsController } from './money-requisitions.controller';
import { MoneyRequisitionsService } from './money-requisitions.service';
import { NotificationModule } from '../notification/notification.module';
import { User } from '../auth/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([MoneyRequisition, User]),
        NotificationModule,
    ],
    controllers: [MoneyRequisitionsController],
    providers: [MoneyRequisitionsService],
    exports: [MoneyRequisitionsService, TypeOrmModule],
})
export class MoneyRequisitionsModule {}
