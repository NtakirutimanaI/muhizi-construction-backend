import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialRequest } from './entities/material-request.entity';
import { MaterialRequestsController } from './material-requests.controller';
import { MaterialRequestsService } from './material-requests.service';
import { NotificationModule } from '../notification/notification.module';
import { ExpensesModule } from '../expenses/expenses.module';
import { User } from '../auth/entities/user.entity';
import { Stock } from '../stock/entities/stock.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([MaterialRequest, User, Stock]),
        NotificationModule,
        forwardRef(() => ExpensesModule),
    ],
    controllers: [MaterialRequestsController],
    providers: [MaterialRequestsService],
    exports: [MaterialRequestsService, TypeOrmModule],
})
export class MaterialRequestsModule {}
