import { MigrationInterface, QueryRunner } from 'typeorm';

export class EnhancePartnerships1730000000013 implements MigrationInterface {
    name = 'EnhancePartnerships1730000000013';

    private async addColumnIfMissing(queryRunner: QueryRunner, column: string, ddl: string): Promise<void> {
        const existing = await queryRunner.query(`
            SELECT COUNT(*) FROM information_schema.columns
            WHERE table_name = 'partnerships' AND column_name = $1
        `, [column]);
        if (parseInt(existing[0]?.count || '0') === 0) {
            await queryRunner.query(`ALTER TABLE "partnerships" ADD COLUMN "${column}" ${ddl}`);
        }
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        // "rejected" is the new application-review outcome — the enum type actually
        // bound to partnerships.status is "partnership_status_enum" (singular).
        await queryRunner.query(`ALTER TYPE "partnership_status_enum" ADD VALUE IF NOT EXISTS 'rejected'`);

        await this.addColumnIfMissing(queryRunner, 'address', 'varchar NULL');
        await this.addColumnIfMissing(queryRunner, 'registrationNumber', 'varchar NULL');
        await this.addColumnIfMissing(queryRunner, 'taxId', 'varchar NULL');
        await this.addColumnIfMissing(queryRunner, 'licenseNumber', 'varchar NULL');
        await this.addColumnIfMissing(queryRunner, 'licenseExpiry', 'date NULL');
        await this.addColumnIfMissing(queryRunner, 'insuranceExpiry', 'date NULL');
        await this.addColumnIfMissing(queryRunner, 'investmentAmount', 'decimal(15,2) NULL');
        await this.addColumnIfMissing(queryRunner, 'equityPercentage', 'decimal(5,2) NULL');
        await this.addColumnIfMissing(queryRunner, 'projectId', 'uuid NULL');
        await this.addColumnIfMissing(queryRunner, 'reviewedById', 'varchar NULL');
        await this.addColumnIfMissing(queryRunner, 'reviewedByName', 'varchar NULL');
        await this.addColumnIfMissing(queryRunner, 'reviewedAt', 'timestamp NULL');

        const hasIndex = await queryRunner.query(`
            SELECT COUNT(*) FROM pg_indexes WHERE indexname = 'idx_partnership_project'
        `);
        if (parseInt(hasIndex[0]?.count || '0') === 0) {
            await queryRunner.query(`CREATE INDEX "idx_partnership_project" ON "partnerships" ("projectId")`);
        }

        const hasConstraint = await queryRunner.query(`
            SELECT COUNT(*) FROM pg_constraint c
            JOIN pg_class t ON c.conrelid = t.oid
            WHERE t.relname = 'partnerships' AND c.conname = 'FK_partnerships_projectId'
        `);
        if (parseInt(hasConstraint[0]?.count || '0') === 0) {
            await queryRunner.query(`
                ALTER TABLE "partnerships"
                ADD CONSTRAINT "FK_partnerships_projectId"
                FOREIGN KEY ("projectId") REFERENCES "construction_projects"("id") ON DELETE SET NULL
            `);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partnerships" DROP CONSTRAINT IF EXISTS "FK_partnerships_projectId"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_partnership_project"`);
        for (const column of [
            'address', 'registrationNumber', 'taxId', 'licenseNumber', 'licenseExpiry',
            'insuranceExpiry', 'investmentAmount', 'equityPercentage', 'projectId',
            'reviewedById', 'reviewedByName', 'reviewedAt',
        ]) {
            await queryRunner.query(`ALTER TABLE "partnerships" DROP COLUMN IF EXISTS "${column}"`);
        }
        // Postgres cannot drop an enum value; "rejected" is left in place on down.
    }
}
