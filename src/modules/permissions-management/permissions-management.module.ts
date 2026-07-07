import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsManagementController } from './permissions-management.controller';
import { PermissionsManagementService } from './permissions-management.service';
import { Permission } from '../permissions/entities/permission.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Permission])],
    controllers: [PermissionsManagementController],
    providers: [PermissionsManagementService],
    exports: [PermissionsManagementService],
})
export class PermissionsManagementModule {}
