import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriber } from './entities/subscriber.entity';
import { SubscribersController } from './subscribers.controller';
import { SubscribersService } from './subscribers.service';
import { MlModule } from '../ml/ml.module';

@Module({
    imports: [TypeOrmModule.forFeature([Subscriber]), MlModule],
    controllers: [SubscribersController],
    providers: [SubscribersService],
})
export class SubscribersModule {}
