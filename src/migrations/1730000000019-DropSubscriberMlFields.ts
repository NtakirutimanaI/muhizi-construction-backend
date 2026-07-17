import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropSubscriberMlFields1730000000019 implements MigrationInterface {
    name = 'DropSubscriberMlFields1730000000019';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscribers" DROP COLUMN IF EXISTS "source"`);
        await queryRunner.query(`ALTER TABLE "subscribers" DROP COLUMN IF EXISTS "mlScore"`);
        await queryRunner.query(`ALTER TABLE "subscribers" DROP COLUMN IF EXISTS "mlCategory"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "subscribers" ADD COLUMN IF NOT EXISTS "source" varchar NULL`);
        await queryRunner.query(`ALTER TABLE "subscribers" ADD COLUMN IF NOT EXISTS "mlScore" integer NOT NULL DEFAULT 50`);
        await queryRunner.query(`ALTER TABLE "subscribers" ADD COLUMN IF NOT EXISTS "mlCategory" varchar NULL`);
    }
}
