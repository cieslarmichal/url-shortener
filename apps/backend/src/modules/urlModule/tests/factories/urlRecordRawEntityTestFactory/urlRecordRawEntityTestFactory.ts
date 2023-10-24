/* eslint-disable @typescript-eslint/naming-convention */
import { Generator } from '../../../../../common/tests/generator.js';
import { type UrlRecordRawEntity } from '../../../infrastructure/entities/urlRecordRawEntity.js';

export class UrlRecordRawEntityTestFactory {
  public create(input: Partial<UrlRecordRawEntity> = {}): UrlRecordRawEntity {
    return {
      _id: Generator.uuid(),
      createdAt: Generator.pastDate(),
      longUrl: Generator.url(),
      shortUrl: Generator.url(),
      ...input,
    };
  }
}
