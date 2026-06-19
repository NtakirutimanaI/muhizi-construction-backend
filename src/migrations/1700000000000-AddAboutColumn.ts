import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddAboutColumn1700000000000 implements MigrationInterface {
    name = 'AddAboutColumn1700000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const hasColumn = await queryRunner.hasColumn('profiles', 'about');
        if (!hasColumn) {
            await queryRunner.addColumn('profiles', new TableColumn({
                name: 'about',
                type: 'text',
                isNullable: true,
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('profiles', 'about');
    }
}
