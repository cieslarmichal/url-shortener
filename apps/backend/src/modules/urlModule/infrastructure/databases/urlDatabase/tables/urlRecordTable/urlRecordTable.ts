import { type UrlRecordRawEntity } from './urlRecordRawEntity.js';
import { type DatabaseTable } from '../../../../../../../common/types/databaseTable.js';

export class UrlRecordTable implements DatabaseTable<UrlRecordRawEntity> {
  public readonly name = 'urlRecords';
  public readonly columns = {
    id: 'id',
    createdAt: 'createdAt',
    shortUrl: 'shortUrl',
    longUrl: 'longUrl',
  } as const;
}
