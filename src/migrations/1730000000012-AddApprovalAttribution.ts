import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddApprovalAttribution1730000000012 implements MigrationInterface {
    name = 'AddApprovalAttribution1730000000012';

    private async addColumnIfMissing(queryRunner: QueryRunner, column: string): Promise<void> {
        const existing = await queryRunner.query(`
            SELECT COUNT(*) FROM information_schema.columns
            WHERE table_name = 'approvals' AND column_name = $1
        `, [column]);
        if (parseInt(existing[0]?.count || '0') === 0) {
            await queryRunner.query(`ALTER TABLE "approvals" ADD COLUMN "${column}" varchar NULL`);
        }
    }

    public async up(queryRunner: QueryRunner): Promise<void> {
        await this.addColumnIfMissing(queryRunner, 'requesterId');
        await this.addColumnIfMissing(queryRunner, 'reviewedById');
        await this.addColumnIfMissing(queryRunner, 'reviewedByName');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "approvals" DROP COLUMN IF EXISTS "requesterId"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP COLUMN IF EXISTS "reviewedById"`);
        await queryRunner.query(`ALTER TABLE "approvals" DROP COLUMN IF EXISTS "reviewedByName"`);
    }
}
