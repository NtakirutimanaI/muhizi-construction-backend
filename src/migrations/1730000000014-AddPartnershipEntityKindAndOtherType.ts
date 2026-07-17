import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPartnershipEntityKindAndOtherType1730000000014 implements MigrationInterface {
    name = 'AddPartnershipEntityKindAndOtherType1730000000014';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Lets a partner that isn't Supplier/Subcontractor/Investor/Joint Venture still be registered.
        await queryRunner.query(`ALTER TYPE "partnership_type_enum" ADD VALUE IF NOT EXISTS 'other'`);

        const hasEntityKindEnum = await queryRunner.query(`
            SELECT COUNT(*) FROM pg_type WHERE typname = 'partnership_entity_kind_enum'
        `);
        if (parseInt(hasEntityKindEnum[0]?.count || '0') === 0) {
            await queryRunner.query(`CREATE TYPE "partnership_entity_kind_enum" AS ENUM('company', 'individual')`);
        }

        const hasEntityKindColumn = await queryRunner.query(`
            SELECT COUNT(*) FROM information_schema.columns
            WHERE table_name = 'partnerships' AND column_name = 'entityKind'
        `);
        if (parseInt(hasEntityKindColumn[0]?.count || '0') === 0) {
            await queryRunner.query(`
                ALTER TABLE "partnerships"
                ADD COLUMN "entityKind" "partnership_entity_kind_enum" NOT NULL DEFAULT 'company'
            `);
        }

        const hasOtherTypeColumn = await queryRunner.query(`
            SELECT COUNT(*) FROM information_schema.columns
            WHERE table_name = 'partnerships' AND column_name = 'otherTypeDescription'
        `);
        if (parseInt(hasOtherTypeColumn[0]?.count || '0') === 0) {
            await queryRunner.query(`ALTER TABLE "partnerships" ADD COLUMN "otherTypeDescription" varchar NULL`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "partnerships" DROP COLUMN IF EXISTS "otherTypeDescription"`);
        await queryRunner.query(`ALTER TABLE "partnerships" DROP COLUMN IF EXISTS "entityKind"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "partnership_entity_kind_enum"`);
        // Postgres cannot drop an enum value; "other" is left in place on down.
    }
}
