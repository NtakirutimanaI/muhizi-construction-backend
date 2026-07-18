import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixContactEmailUniqueIndex1730000000022 implements MigrationInterface {
    name = '1730000000022-FixContactEmailUniqueIndex';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop the UNIQUE index on email — multiple contacts with the same email are valid
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_contact_email"`);
        // Recreate as a plain (non-unique) index
        await queryRunner.query(`CREATE INDEX "idx_contact_email" ON "contact_messages" ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_contact_email"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_contact_email" ON "contact_messages" ("email")`);
    }
}
