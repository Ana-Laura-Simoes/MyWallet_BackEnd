import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterValueTransactionsTable1629160245287 implements MigrationInterface {
    name = 'AlterValueTransactionsTable1629160245287'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "value" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transactions" DROP COLUMN "value"`);
        await queryRunner.query(`ALTER TABLE "transactions" ADD "value" integer NOT NULL`);
    }

}
