import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePettyCashTable1735000000000 implements MigrationInterface {
    name = 'CreatePettyCashTable1735000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "petty_cash" (
                "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
                "description" character varying NOT NULL,
                "amount" numeric(15,2) NOT NULL,
                "type" character varying NOT NULL,
                "date" date NOT NULL,
                "receivedFrom" character varying,
                "paidTo" character varying,
                "reference" character varying,
                "notes" text,
                "recordedById" character varying,
                "recordedByName" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_petty_cash_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "petty_cash"`);
    }
}
