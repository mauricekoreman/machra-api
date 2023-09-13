import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class DropActiveStoryColumn1694621927938 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('story', 'active');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'story',
      new TableColumn({
        name: 'active',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    );
  }
}
