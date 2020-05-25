import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateItemTable1590430830595 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`
        CREATE TABLE
          item (  id                  SERIAL PRIMARY KEY,
                  name                VARCHAR(100) NOT NULL,
                  description         VARCHAR(100) NOT NULL,
                  price               INTEGER NOT NULL,
                  weight              INTEGER NOT NULL,
                  "purchaseDate"      timestamp without time zone,
                  "purchaseDetails"   VARCHAR(100),
                  "purchaseLocation"  VARCHAR(100),
                  "categoryId"        INTEGER NOT NULL,
                  "userId"            INTEGER NOT NULL,
                  FOREIGN KEY ("userId") REFERENCES "user" (id),
                  FOREIGN KEY ("categoryId") REFERENCES "category" (id));`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      await queryRunner.query(`DROP TABLE item;`);
    }

}
