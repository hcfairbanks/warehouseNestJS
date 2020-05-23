import {MigrationInterface, QueryRunner} from "typeorm";

// https://stackoverflow.com/questions/59435293/typeorm-entity-in-nestjs-cannot-use-import-statement-outside-a-module

export class testme1590171544091 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`CREATE TABLE account();`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`DROP TABLE account;`);
    }

}

// PSQL SYNTAX
// CREATE TABLE account(
// 	user_id serial PRIMARY KEY,
// 	username VARCHAR (50) UNIQUE NOT NULL,
// 	password VARCHAR (50) NOT NULL,
// 	email VARCHAR (355) UNIQUE NOT NULL,
// 	created_on TIMESTAMP NOT NULL,
// 	last_login TIMESTAMP
// );