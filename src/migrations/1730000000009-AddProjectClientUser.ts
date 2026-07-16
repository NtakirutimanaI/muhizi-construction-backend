import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectClientUser1730000000009 implements MigrationInterface {
    name = 'AddProjectClientUser1730000000009';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasColumn = await queryRunner.query(`
            SELECT COUNT(*) FROM information_schema.columns
            WHERE table_name = 'construction_projects' AND column_name = 'clientUserId'
        `);
        if (parseInt(hasColumn[0]?.count || '0') === 0) {
            await queryRunner.query(`
                ALTER TABLE "construction_projects"
                ADD COLUMN "clientUserId" uuid NULL
            `);
        }

        const hasIndex = await queryRunner.query(`
            SELECT COUNT(*) FROM pg_indexes
            WHERE indexname = 'idx_project_client_user'
        `);
        if (parseInt(hasIndex[0]?.count || '0') === 0) {
            await queryRunner.query(`
                CREATE INDEX "idx_project_client_user"
                ON "construction_projects" ("clientUserId")
            `);
        }

        const hasConstraint = await queryRunner.query(`
            SELECT COUNT(*) FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            WHERE t.relname = 'construction_projects'
            AND c.conname = 'FK_construction_projects_clientUserId'
        `);
        if (parseInt(hasConstraint[0]?.count || '0') === 0) {
            await queryRunner.query(`
                ALTER TABLE "construction_projects"
                ADD CONSTRAINT "FK_construction_projects_clientUserId"
                FOREIGN KEY ("clientUserId") REFERENCES "users"("id") ON DELETE SET NULL
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "construction_projects" DROP CONSTRAINT IF EXISTS "FK_construction_projects_clientUserId"
        `);
        await queryRunner.query(`
            DROP INDEX IF EXISTS "idx_project_client_user"
        `);
        await queryRunner.query(`
            ALTER TABLE "construction_projects" DROP COLUMN IF EXISTS "clientUserId"
        `);
    }
}
