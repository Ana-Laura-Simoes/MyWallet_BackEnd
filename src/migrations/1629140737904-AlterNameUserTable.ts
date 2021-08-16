import {MigrationInterface, QueryRunner} from "typeorm";

export class AlterNameUserTable1629140737904 implements MigrationInterface {
    name = 'AlterNameUserTable1629140737904'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "name"`);
    }

}
