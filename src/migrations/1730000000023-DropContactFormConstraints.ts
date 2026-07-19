import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropContactFormConstraints1730000000023 implements MigrationInterface {
    name = '1730000000023-DropContactFormConstraints';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop the phone CHECK constraint on contact_messages — public forms should accept any phone format
        await queryRunner.query(`ALTER TABLE "contact_messages" DROP CONSTRAINT IF EXISTS "chk_contact_phone"`);
        // Drop the unique email index — multiple contacts with the same email are valid
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_contact_email"`);
        await queryRunner.query(`CREATE INDEX "idx_contact_email" ON "contact_messages" ("email")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_contact_email"`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_contact_email" ON "contact_messages" ("email")`);
        await queryRunner.query(
            `ALTER TABLE "contact_messages" ADD CONSTRAINT "chk_contact_phone" CHECK ("phone" IS NULL OR "phone" ~ '^\\+\\d[- .()0-9]+\\d$') NOT VALID`
        );
    }
}
