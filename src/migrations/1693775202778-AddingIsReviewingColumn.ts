import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddingIsReviewingColumn1693775202778
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'story',
      new TableColumn({
        name: 'isReviewed',
        type: 'boolean',
        isNullable: false,
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('story', 'isReviewed');
  }
}
