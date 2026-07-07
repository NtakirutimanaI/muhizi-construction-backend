import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

const ROLE_ALIASES: Partial<Record<Role, Role[]>> = {
    [Role.MANAGING_DIRECTOR]: [Role.MANAGER, Role.MANAGING_DIRECTOR],
    [Role.FINANCE_DIRECTOR]: [Role.SITE_MANAGER, Role.MANAGER, Role.FINANCE_DIRECTOR],
    [Role.SITE_ENGINEER]: [Role.SITE_MANAGER, Role.SITE_ENGINEER],
    [Role.ENGINEERING_STUDIO]: [Role.EMPLOYEE, Role.ENGINEERING_STUDIO],
};

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true;
        }
        const { user } = context.switchToHttp().getRequest();
        const userRoles = ROLE_ALIASES[user.role] || [user.role];
        return userRoles.some(r => requiredRoles.includes(r));
    }
}
