import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './services/notification.service';
import { NotificationCronService } from './services/notification-cron.service';
import { Notification } from './entities/notification.entity';
import { User } from '../auth/entities/user.entity';
import { EventsModule } from '../events/events.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Notification, User]),
        EventsModule,
    ],
    controllers: [NotificationController],
    providers: [NotificationService, NotificationCronService],
    exports: [NotificationService],
})
export class NotificationModule { }
