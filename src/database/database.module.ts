import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseSeeder } from './database.seeder';
import { User } from '../modules/auth/entities/user.entity';
import { Profile } from '../modules/profile/entities/profile.entity';

@Module({
    imports: [TypeOrmModule.forFeature([User, Profile])],
    providers: [DatabaseSeeder],
    exports: [DatabaseSeeder],
})
export class DatabaseModule { }
