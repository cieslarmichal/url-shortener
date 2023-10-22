import { type UrlRecordMapper } from './urlRecordMapper/urlRecordMapper.js';
import { RepositoryError } from '../../../../../common/errors/common/repositoryError.js';
import { type PostgresDatabaseClient } from '../../../../../core/database/postgresDatabaseClient/postgresDatabaseClient.js';
import { type QueryBuilder } from '../../../../../libs/database/types/queryBuilder.js';
import { type UuidService } from '../../../../../libs/uuid/services/uuidService/uuidService.js';
import { type UrlRecord } from '../../../domain/entities/urlRecord/urlRecord.js';
import {
  type FindPayload,
  type CreatePayload,
  type UrlRecordRepository,
  type FindByIdPayload,
} from '../../../domain/repositories/urlRecordRepository/urlRecordRepository.js';
import { type UrlRecordRawEntity } from '../../databases/urlDatabase/tables/urlRecordTable/urlRecordRawEntity.js';
import { UrlRecordTable } from '../../databases/urlDatabase/tables/urlRecordTable/urlRecordTable.js';

export class UrlRecordRepositoryImpl implements UrlRecordRepository {
  private readonly databaseTable = new UrlRecordTable();

  public constructor(
    private readonly postgresDatabaseClient: PostgresDatabaseClient,
    private readonly urlRecordMapper: UrlRecordMapper,
    private readonly uuidService: UuidService,
  ) {}

  private createQueryBuilder(): QueryBuilder<UrlRecordRawEntity> {
    return this.postgresDatabaseClient<UrlRecordRawEntity>(this.databaseTable.name);
  }

  public async create(payload: CreatePayload): Promise<UrlRecord> {
    const { shortUrl, longUrl } = payload;

    const queryBuilder = this.createQueryBuilder();

    let rawEntities: UrlRecordRawEntity[];

    const id = this.uuidService.generateUuid();

    const createdAt = new Date();

    try {
      rawEntities = await queryBuilder.insert(
        {
          id,
          createdAt,
          shortUrl,
          longUrl,
        },
        '*',
      );
    } catch (error) {
      throw new RepositoryError({
        entity: 'UrlRecord',
        operation: 'create',
      });
    }

    const rawEntity = rawEntities[0] as UrlRecordRawEntity;

    return this.urlRecordMapper.mapToDomain(rawEntity);
  }

  public async find(payload: FindPayload): Promise<UrlRecord | null> {
    const { shortUrl, longUrl } = payload;

    const queryBuilder = this.createQueryBuilder();

    let whereCondition: Partial<UrlRecordRawEntity> = {};

    if (shortUrl) {
      whereCondition = {
        ...whereCondition,
        shortUrl,
      };
    }

    if (longUrl) {
      whereCondition = {
        ...whereCondition,
        longUrl,
      };
    }

    let rawEntity: UrlRecordRawEntity | undefined;

    try {
      rawEntity = await queryBuilder.select('*').where(whereCondition).first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'UrlRecord',
        operation: 'find',
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.urlRecordMapper.mapToDomain(rawEntity);
  }

  public async findById(payload: FindByIdPayload): Promise<UrlRecord | null> {
    const { id } = payload;

    const queryBuilder = this.createQueryBuilder();

    let rawEntity: UrlRecordRawEntity | undefined;

    try {
      rawEntity = await queryBuilder.select('*').where({ id }).first();
    } catch (error) {
      throw new RepositoryError({
        entity: 'UrlRecord',
        operation: 'find',
      });
    }

    if (!rawEntity) {
      return null;
    }

    return this.urlRecordMapper.mapToDomain(rawEntity);
  }
}
