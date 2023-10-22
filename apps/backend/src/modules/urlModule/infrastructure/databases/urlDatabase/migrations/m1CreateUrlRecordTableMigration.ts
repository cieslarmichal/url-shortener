import { type DatabaseClient } from '../../../../../../libs/database/clients/databaseClient/databaseClient.js';
import { type Migration } from '../../../../../../libs/database/types/migration.js';

export class M1CreateUrlRecordTableMigration implements Migration {
  public readonly name = 'M1CreateUrlRecordTableMigration';

  public async up(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.createTable('urlRecords', (table) => {
      table.text('id');

      table.timestamp('createdAt').notNullable();

      table.text('shortUrl').notNullable();

      table.text('longUrl').notNullable();

      table.primary(['id']);

      table.unique(['shortUrl, longUrl']);

      table.index('shortUrl');

      table.index('longUrl');
    });
  }

  public async down(databaseClient: DatabaseClient): Promise<void> {
    await databaseClient.schema.dropTable('urlRecords');
  }
}
