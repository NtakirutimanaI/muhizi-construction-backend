import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsManagementController } from './permissions-management.controller';
import { PermissionsManagementService } from './permissions-management.service';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { Permission } from '../permissions/entities/permission.entity';

/**
 * PermissionsGuard is registered as a global guard (APP_GUARD) rather than
 * referenced via per-controller @UseGuards(PermissionsGuard) — a class passed
 * directly to @UseGuards() is resolved through the *consuming* controller's
 * own module injector, which has no way to supply the Permission repository
 * unless that module imports this one. APP_GUARD sidesteps that: it runs on
 * every request (module import order puts it after AuthModule's JwtAuthGuard,
 * so req.user is already populated), and it no-ops for any route without a
 * @RequirePermissions() decorator, so untouched controllers are unaffected.
 */
@Module({
    imports: [TypeOrmModule.forFeature([Permission])],
    controllers: [PermissionsManagementController],
    providers: [
        PermissionsManagementService,
        { provide: APP_GUARD, useClass: PermissionsGuard },
    ],
    exports: [PermissionsManagementService],
})
export class PermissionsManagementModule {}
