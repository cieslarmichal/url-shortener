import { type UrlRecordMapper } from './urlRecordMapper.js';
import { UrlRecord } from '../../../../domain/entities/urlRecord/urlRecord.js';
import { type UrlRecordRawEntity } from '../../../databases/urlDatabase/tables/urlRecordTable/urlRecordRawEntity.js';

export class UrlRecordMapperImpl implements UrlRecordMapper {
  public mapToDomain(entity: UrlRecordRawEntity): UrlRecord {
    const { id, createdAt, shortUrl, longUrl } = entity;

    return new UrlRecord({
      id,
      createdAt,
      shortUrl,
      longUrl,
    });
  }
}
