import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../permissions/entities/permission.entity';

@Injectable()
export class PermissionsManagementService {
    constructor(
        @InjectRepository(Permission)
        private repo: Repository<Permission>,
    ) {}

    async findAll() {
        return this.repo.find({ order: { role: 'ASC', resource: 'ASC', action: 'ASC' } });
    }

    async findByRole(role: string) {
        return this.repo.find({ where: { role }, order: { resource: 'ASC', action: 'ASC' } });
    }

    /** Replaces every granted permission for a role with the given "resource:action" list. */
    async updateByRole(role: string, permissions: string[]) {
        if (!Array.isArray(permissions)) {
            throw new BadRequestException('Body must be an array of "resource:action" permission strings');
        }
        await this.repo.delete({ role });
        const rows = permissions.map((permission) => {
            const [resource, action] = permission.split(':');
            if (!resource || !action) {
                throw new BadRequestException(`Invalid permission string "${permission}" — expected "resource:action"`);
            }
            return this.repo.create({ role, resource, action, allowed: true, isActive: true });
        });
        return this.repo.save(rows);
    }
}
