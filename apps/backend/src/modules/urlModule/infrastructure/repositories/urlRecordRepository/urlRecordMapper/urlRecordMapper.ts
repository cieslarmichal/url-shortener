import { type UrlRecord } from '../../../../domain/entities/urlRecord/urlRecord.js';
import { type UrlRecordRawEntity } from '../../../databases/urlDatabase/tables/urlRecordTable/urlRecordRawEntity.js';

export interface UrlRecordMapper {
  mapToDomain(rawEntity: UrlRecordRawEntity): UrlRecord;
}
