import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropUsernameColumn1730000000024 implements MigrationInterface {
    name = 'DropUsernameColumn1730000000024';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_users_username"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN IF EXISTS "username"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD COLUMN "username" VARCHAR NOT NULL DEFAULT ''`);
        await queryRunner.query(`CREATE UNIQUE INDEX "idx_users_username" ON "users" ("username")`);
    }
}
