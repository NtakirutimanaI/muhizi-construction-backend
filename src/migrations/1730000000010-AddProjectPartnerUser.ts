import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProjectPartnerUser1730000000010 implements MigrationInterface {
    name = 'AddProjectPartnerUser1730000000010';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasColumn = await queryRunner.query(`
            SELECT COUNT(*) FROM information_schema.columns
            WHERE table_name = 'construction_projects' AND column_name = 'partnerUserId'
        `);
        if (parseInt(hasColumn[0]?.count || '0') === 0) {
            await queryRunner.query(`
                ALTER TABLE "construction_projects"
                ADD COLUMN "partnerUserId" uuid NULL
            `);
        }

        const hasIndex = await queryRunner.query(`
            SELECT COUNT(*) FROM pg_indexes
            WHERE indexname = 'idx_project_partner_user'
        `);
        if (parseInt(hasIndex[0]?.count || '0') === 0) {
            await queryRunner.query(`
                CREATE INDEX "idx_project_partner_user"
                ON "construction_projects" ("partnerUserId")
            `);
        }

        const hasConstraint = await queryRunner.query(`
            SELECT COUNT(*) FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            WHERE t.relname = 'construction_projects'
            AND c.conname = 'FK_construction_projects_partnerUserId'
        `);
        if (parseInt(hasConstraint[0]?.count || '0') === 0) {
            await queryRunner.query(`
                ALTER TABLE "construction_projects"
                ADD CONSTRAINT "FK_construction_projects_partnerUserId"
                FOREIGN KEY ("partnerUserId") REFERENCES "users"("id") ON DELETE SET NULL
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "construction_projects" DROP CONSTRAINT IF EXISTS "FK_construction_projects_partnerUserId"
        `);
        await queryRunner.query(`
            DROP INDEX IF EXISTS "idx_project_partner_user"
        `);
        await queryRunner.query(`
            ALTER TABLE "construction_projects" DROP COLUMN IF EXISTS "partnerUserId"
        `);
    }
}
