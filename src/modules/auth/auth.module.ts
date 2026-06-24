import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { Profile } from '../profile/entities/profile.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';
import { EventsModule } from '../events/events.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Profile]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET') || 'default-secret',
                signOptions: {
                    expiresIn: configService.get('JWT_EXPIRES_IN', '7d'),
                },
            }),
            inject: [ConfigService],
        }),
        EventsModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RolesGuard],
    exports: [AuthService, JwtStrategy, PassportModule, RolesGuard],
})
export class AuthModule { }
