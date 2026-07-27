import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUpdates1730000000028 implements MigrationInterface {
    name = 'CreateUpdates1730000000028';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "updates" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "slug" character varying NOT NULL,
                "summary" text,
                "content" text,
                "image" character varying,
                "category" character varying,
                "author" character varying,
                "readTime" character varying,
                "comments" integer NOT NULL DEFAULT 0,
                "isPublished" boolean NOT NULL DEFAULT false,
                "publishedAt" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_updates_id" PRIMARY KEY ("id"),
                CONSTRAINT "UQ_updates_slug" UNIQUE ("slug")
            )
        `);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_update_title" ON "updates" ("title")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_update_slug" ON "updates" ("slug")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_update_published" ON "updates" ("isPublished")`);
        await queryRunner.query(`CREATE INDEX IF NOT EXISTS "idx_update_created" ON "updates" ("createdAt")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS "updates"`);
    }
}
