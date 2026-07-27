import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePettyCashVoucherTable1735000000001 implements MigrationInterface {
    name = 'CreatePettyCashVoucherTable1735000000001';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "petty_cash_vouchers" (
                "id" uuid DEFAULT uuid_generate_v4() NOT NULL,
                "payee" character varying NOT NULL,
                "amount" numeric(15,2) NOT NULL,
                "purpose" character varying NOT NULL,
                "date" date NOT NULL,
                "department" character varying,
                "paymentMethod" character varying,
                "reference" character varying,
                "description" text,
                "status" character varying NOT NULL DEFAULT 'draft',
                "recordedById" character varying,
                "recordedByName" character varying,
                "approvedById" character varying,
                "approvedByName" character varying,
                "approvedAt" character varying,
                "rejectionReason" character varying,
                "receivedBySignature" character varying,
                "authorizedByName" character varying,
                "authorizedBySignature" character varying,
                "authorizationDate" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_petty_cash_voucher_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "petty_cash_vouchers"`);
    }
}
