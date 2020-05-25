import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateUserTable1590428662326 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`CREATE TABLE "user" (
                                id              SERIAL PRIMARY KEY,
                                username           VARCHAR NOT NULL,
                                email           VARCHAR NOT NULL UNIQUE,
                                password           VARCHAR NOT NULL,
                                salt           VARCHAR NOT NULL );`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`DROP TABLE "user";`);
    }
}