import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategoriesTable1710000000000 implements MigrationInterface {
    name = 'CreateCategoriesTable1710000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                value VARCHAR(100) NOT NULL UNIQUE,
                label VARCHAR(200) NOT NULL,
                "isBuiltin" BOOLEAN NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now()
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS categories`);
    }
}
