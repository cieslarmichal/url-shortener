import { type PostgresDatabaseClient } from '../../../../../core/database/postgresDatabaseClient/postgresDatabaseClient.js';
import { type QueryBuilder } from '../../../../../libs/database/types/queryBuilder.js';
import { type UrlRecordRawEntity } from '../../../infrastructure/databases/urlDatabase/tables/urlRecordTable/urlRecordRawEntity.js';
import { UrlRecordTable } from '../../../infrastructure/databases/urlDatabase/tables/urlRecordTable/urlRecordTable.js';

interface PersistPayload {
  urlRecord: UrlRecordRawEntity;
}

interface FindByEmailPayload {
  email: string;
}

interface FindByIdPayload {
  id: string;
}

export class UrlRecordTestUtils {
  private readonly databaseTable = new UrlRecordTable();

  public constructor(private readonly postgresDatabaseClient: PostgresDatabaseClient) {}

  private createQueryBuilder(): QueryBuilder<UrlRecordRawEntity> {
    return this.postgresDatabaseClient<UrlRecordRawEntity>(this.databaseTable.name);
  }

  public async persist(payload: PersistPayload): Promise<void> {
    const { urlRecord } = payload;

    const queryBuilder = this.createQueryBuilder();

    await queryBuilder.insert(urlRecord);
  }

  public async findByEmail(payload: FindByEmailPayload): Promise<UrlRecordRawEntity | undefined> {
    const { email } = payload;

    const queryBuilder = this.createQueryBuilder();

    const urlRecordRawEntity = await queryBuilder.select('*').where({ email }).first();

    return urlRecordRawEntity;
  }

  public async findById(payload: FindByIdPayload): Promise<UrlRecordRawEntity | undefined> {
    const { id } = payload;

    const queryBuilder = this.createQueryBuilder();

    const urlRecordRawEntity = await queryBuilder.select('*').where({ id }).first();

    return urlRecordRawEntity;
  }

  public async truncate(): Promise<void> {
    const queryBuilder = this.createQueryBuilder();

    await queryBuilder.truncate();
  }
}
