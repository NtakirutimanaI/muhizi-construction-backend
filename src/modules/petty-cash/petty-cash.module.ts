import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PettyCash } from './entities/petty-cash.entity';
import { PettyCashController } from './petty-cash.controller';
import { PettyCashService } from './petty-cash.service';

@Module({
    imports: [TypeOrmModule.forFeature([PettyCash])],
    controllers: [PettyCashController],
    providers: [PettyCashService],
})
export class PettyCashModule {}
