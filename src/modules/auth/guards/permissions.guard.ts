import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { Permission } from '../../permissions/entities/permission.entity';
import { Role } from '../enums/role.enum';

interface CacheEntry {
    grantedActions: Set<string>;
    expiresAt: number;
}

const CACHE_TTL_MS = 15_000;

@Injectable()
export class PermissionsGuard implements CanActivate {
    private cache = new Map<string, CacheEntry>();

    constructor(
        private reflector: Reflector,
        @InjectRepository(Permission)
        private repo: Repository<Permission>,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermissions = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredPermissions || requiredPermissions.length === 0) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        if (!user) return false;
        if (user.role === Role.ADMIN) return true;

        const granted = await this.getGrantedActions(user.role);
        return requiredPermissions.some((p) => granted.has(p));
    }

    private async getGrantedActions(role: string): Promise<Set<string>> {
        const cached = this.cache.get(role);
        if (cached && cached.expiresAt > Date.now()) {
            return cached.grantedActions;
        }
        const rows = await this.repo.find({ where: { role, allowed: true, isActive: true } });
        const grantedActions = new Set(rows.map((r) => `${r.resource}:${r.action}`));
        this.cache.set(role, { grantedActions, expiresAt: Date.now() + CACHE_TTL_MS });
        return grantedActions;
    }
}
