import { Generator } from '../../../../../common/tests/generator.js';
import { type UrlRecordRawEntity } from '../../../infrastructure/databases/urlDatabase/tables/urlRecordTable/urlRecordRawEntity.js';

export class UrlRecordRawEntityTestFactory {
  public create(input: Partial<UrlRecordRawEntity> = {}): UrlRecordRawEntity {
    return {
      id: Generator.uuid(),
      createdAt: Generator.pastDate(),
      longUrl: Generator.url(),
      shortUrl: Generator.url(),
      ...input,
    };
  }
}
