import { UrlDatabaseMigrationSource } from './urlDatabaseMigrationSource.js';
import { Application } from '../../../../../core/application.js';
import { type PostgresDatabaseClient } from '../../../../../core/database/postgresDatabaseClient/postgresDatabaseClient.js';
import { coreSymbols } from '../../../../../core/symbols.js';

export class UrlDatabaseManager {
  public static async booststrapDatabase(): Promise<void> {
    const container = Application.createContainer();

    const databaseClient = container.get<PostgresDatabaseClient>(coreSymbols.postgresDatabaseClient);

    const migrationSource = new UrlDatabaseMigrationSource();

    await databaseClient.migrate.latest({
      migrationSource,
      tableName: migrationSource.getMigrationTableName(),
    });

    await databaseClient.destroy();
  }

  public static async teardownDatabase(): Promise<void> {
    const container = Application.createContainer();

    const databaseClient = container.get<PostgresDatabaseClient>(coreSymbols.postgresDatabaseClient);

    const migrationSource = new UrlDatabaseMigrationSource();

    await databaseClient.migrate.rollback({
      migrationSource,
      tableName: migrationSource.getMigrationTableName(),
    });

    await databaseClient.destroy();
  }
}
