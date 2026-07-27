import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Update } from './entities/update.entity';
import { UpdatesController } from './updates.controller';
import { UpdatesService } from './updates.service';

@Module({
    imports: [TypeOrmModule.forFeature([Update])],
    controllers: [UpdatesController],
    providers: [UpdatesService],
    exports: [UpdatesService],
})
export class UpdatesModule {}
