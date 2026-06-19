import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ChatModule } from './modules/chat/chat.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { EventsModule } from './modules/events/events.module';
import { DatabaseModule } from './database/database.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const url = configService.get<string>('DATABASE_URL');
                if (url) {
                    return {
                        type: 'postgres',
                        url,
                        ssl: { rejectUnauthorized: false },
                        autoLoadEntities: true,
                        synchronize: configService.get('NODE_ENV') !== 'production',
                        logging: configService.get('NODE_ENV') === 'development',
                    };
                }
                return {
                    type: 'postgres',
                    host: configService.get('DB_HOST', 'localhost'),
                    port: configService.get('DB_PORT', 5432),
                    username: configService.get('DB_USERNAME', 'postgres'),
                    password: configService.get('DB_PASSWORD', '123Rw@nd@'),
                    database: configService.get('DB_DATABASE', 'profile_db'),
                    ssl: false,
                    autoLoadEntities: true,
                    synchronize: configService.get('NODE_ENV') !== 'production',
                    logging: configService.get('NODE_ENV') === 'development',
                };
            },
            inject: [ConfigService],
        }),
        ScheduleModule.forRoot(),
        AuthModule,
        ProfileModule,
        ChatModule,
        NotificationModule,
        ResourcesModule,
        EventsModule,
        DatabaseModule,
    ],
})
export class AppModule {}
