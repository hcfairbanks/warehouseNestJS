import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateCategoryTable1590429347874 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`CREATE TABLE category (
                              id              SERIAL PRIMARY KEY,
                              name           VARCHAR(100) NOT NULL );`);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`DROP TABLE category;`);
  }

}
