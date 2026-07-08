import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { Profile } from './entities/profile.entity';
import { ContactMessage } from './entities/contact-message.entity';
import { EventsModule } from '../events/events.module';
import { NotificationModule } from '../notification/notification.module';
import { User } from '../auth/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Profile, ContactMessage, User]),
        EventsModule,
        NotificationModule,
    ],
    controllers: [ProfileController],
    providers: [ProfileService],
    exports: [ProfileService],
})
export class ProfileModule { }
