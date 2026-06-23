import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MaterialRequest } from './entities/material-request.entity';
import { MaterialRequestsController } from './material-requests.controller';
import { MaterialRequestsService } from './material-requests.service';

@Module({
    imports: [TypeOrmModule.forFeature([MaterialRequest])],
    controllers: [MaterialRequestsController],
    providers: [MaterialRequestsService],
    exports: [MaterialRequestsService],
})
export class MaterialRequestsModule {}
