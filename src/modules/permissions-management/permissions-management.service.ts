import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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
        return this.repo.find({ order: { role: 'ASC', action: 'ASC' } });
    }

    async findByRole(role: string) {
        const permissions = await this.repo.find({ where: { role } });
        if (!permissions.length) throw new NotFoundException(`No permissions found for role "${role}"`);
        return permissions;
    }

    async updateByRole(role: string, actions: string[]) {
        if (!Array.isArray(actions)) {
            throw new BadRequestException('Body must be an array of permission strings');
        }
        await this.repo.delete({ role });
        const permissions = actions.map(action => this.repo.create({ role, action }));
        return this.repo.save(permissions);
    }
}
