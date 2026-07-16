import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Seeds the permissions table with grants that exactly match what each role
 * already has today via the hardcoded @Roles() decorators on the routes now
 * wired to PermissionsGuard (see profile/resources/notification/incomes/
 * expenses/payroll/reports/projects/designs controllers). This is what makes
 * turning enforcement on non-destructive: nobody's current access changes,
 * it just becomes revocable/grantable from the admin Permissions page.
 */
const DEFAULT_GRANTS: { role: string; resource: string; action: string }[] = [
    // Managing Director
    { role: 'managing_director', resource: 'messages', action: 'read' },
    { role: 'managing_director', resource: 'resources', action: 'read' },
    { role: 'managing_director', resource: 'notifications', action: 'read' },

    // Finance Director
    { role: 'finance_director', resource: 'messages', action: 'read' },
    { role: 'finance_director', resource: 'resources', action: 'read' },
    { role: 'finance_director', resource: 'notifications', action: 'read' },
    { role: 'finance_director', resource: 'incomes', action: 'read' },
    { role: 'finance_director', resource: 'incomes', action: 'create' },
    { role: 'finance_director', resource: 'incomes', action: 'update' },
    { role: 'finance_director', resource: 'expenses', action: 'read' },
    { role: 'finance_director', resource: 'expenses', action: 'create' },
    { role: 'finance_director', resource: 'expenses', action: 'update' },
    { role: 'finance_director', resource: 'payroll', action: 'read' },
    { role: 'finance_director', resource: 'reports', action: 'read' },

    // Site Engineer
    { role: 'site_engineer', resource: 'messages', action: 'read' },
    { role: 'site_engineer', resource: 'messages', action: 'update' },
    { role: 'site_engineer', resource: 'resources', action: 'read' },
    { role: 'site_engineer', resource: 'resources', action: 'create' },
    { role: 'site_engineer', resource: 'resources', action: 'update' },
    { role: 'site_engineer', resource: 'notifications', action: 'read' },
    { role: 'site_engineer', resource: 'projects', action: 'read' },
    { role: 'site_engineer', resource: 'designs', action: 'read' },

    // Engineering Studio
    { role: 'engineering_studio', resource: 'messages', action: 'read' },
    { role: 'engineering_studio', resource: 'resources', action: 'read' },
    { role: 'engineering_studio', resource: 'projects', action: 'read' },
    { role: 'engineering_studio', resource: 'designs', action: 'read' },
    { role: 'engineering_studio', resource: 'designs', action: 'create' },
    { role: 'engineering_studio', resource: 'designs', action: 'update' },
];

export class SeedDefaultPermissions1730000000011 implements MigrationInterface {
    name = 'SeedDefaultPermissions1730000000011';

    public async up(queryRunner: QueryRunner): Promise<void> {
        for (const grant of DEFAULT_GRANTS) {
            const existing = await queryRunner.query(
                `SELECT id FROM permissions WHERE role = $1 AND resource = $2 AND action = $3`,
                [grant.role, grant.resource, grant.action],
            );
            if (existing.length === 0) {
                await queryRunner.query(
                    `INSERT INTO permissions (id, role, resource, action, allowed, "isActive", "createdAt", "updatedAt")
                     VALUES (uuid_generate_v4(), $1, $2, $3, true, true, now(), now())`,
                    [grant.role, grant.resource, grant.action],
                );
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        for (const grant of DEFAULT_GRANTS) {
            await queryRunner.query(
                `DELETE FROM permissions WHERE role = $1 AND resource = $2 AND action = $3`,
                [grant.role, grant.resource, grant.action],
            );
        }
    }
}
