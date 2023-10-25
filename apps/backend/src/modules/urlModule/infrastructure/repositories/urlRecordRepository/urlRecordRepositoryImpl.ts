/* eslint-disable @typescript-eslint/naming-convention */
import { type UrlRecordMapper } from './urlRecordMapper/urlRecordMapper.js';
import { RepositoryError } from '../../../../../common/errors/common/repositoryError.js';
import { type UuidService } from '../../../../../libs/uuid/services/uuidService/uuidService.js';
import { type UrlRecord } from '../../../domain/entities/urlRecord/urlRecord.js';
import {
  type FindPayload,
  type CreatePayload,
  type UrlRecordRepository,
} from '../../../domain/repositories/urlRecordRepository/urlRecordRepository.js';
import { urlRecordRawEntityModel, type UrlRecordRawEntity } from '../../entities/urlRecordRawEntity.js';

export class UrlRecordRepositoryImpl implements UrlRecordRepository {
  public constructor(
    private readonly urlRecordMapper: UrlRecordMapper,
    private readonly uuidService: UuidService,
  ) {}

  public async create(payload: CreatePayload): Promise<UrlRecord> {
    const { shortUrl, longUrl } = payload;

    let rawEntity: UrlRecordRawEntity;

    const id = this.uuidService.generateUuid();

    const createdAt = new Date();

    try {
      rawEntity = await urlRecordRawEntityModel.create({
        _id: id,
        createdAt,
        longUrl,
        shortUrl,
      });
    } catch (error) {
      throw new RepositoryError({
        entity: 'UrlRecord',
        operation: 'create',
      });
    }

    return this.urlRecordMapper.mapToDomain(rawEntity);
  }

  public async find(payload: FindPayload): Promise<UrlRecord | null> {
    const { shortUrl, longUrl } = payload;

    let rawEntity: UrlRecordRawEntity | null;

    try {
      rawEntity = await urlRecordRawEntityModel.findOne({
        longUrl,
        shortUrl,
      });
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
