import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        if (!user) return false;
        const rolePermissions: Record<string, string[]> = {
            admin: ['*'],
            site_manager: ['profile:read', 'profile:update', 'messages:read', 'messages:update', 'resources:read', 'resources:create', 'resources:update', 'notifications:read', 'visitors:read'],
            manager: ['profile:read', 'messages:read', 'resources:read', 'notifications:read', 'visitors:read'],
            employee: ['profile:read', 'messages:read', 'resources:read'],
            client: ['profile:read'],
        };
        const userPermissions = rolePermissions[user.role] || [];
        if (userPermissions.includes('*')) return true;
        return requiredPermissions.some(p => userPermissions.includes(p));
    }
}
