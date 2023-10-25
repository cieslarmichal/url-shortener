import { type UrlRecord } from '../../../domain/entities/urlRecord/urlRecord.js';
import {
  urlRecordRawEntityModel,
  type UrlRecordRawEntity,
} from '../../../infrastructure/entities/urlRecordRawEntity.js';
import { UrlRecordRawEntityTestFactory } from '../../factories/urlRecordRawEntityTestFactory/urlRecordRawEntityTestFactory.js';

interface PersistPayload {
  urlRecord: UrlRecord;
}

interface FindByShortUrlPayload {
  shortUrl: string;
}

export class UrlRecordTestUtils {
  private readonly urlRecordRawEntityTestFactory = new UrlRecordRawEntityTestFactory();

  public async createAndPersist(input: Partial<UrlRecordRawEntity> = {}): Promise<UrlRecordRawEntity> {
    const urlRecord = this.urlRecordRawEntityTestFactory.create(input);

    const urlRecordRawEntity = await urlRecordRawEntityModel.create(urlRecord);

    return urlRecordRawEntity;
  }

  public async persist(payload: PersistPayload): Promise<void> {
    const { urlRecord } = payload;

    await urlRecordRawEntityModel.create(urlRecord);
  }

  public async findByShortUrl(payload: FindByShortUrlPayload): Promise<UrlRecordRawEntity | null> {
    const { shortUrl } = payload;

    const urlRecordRawEntity = await urlRecordRawEntityModel.findOne({ shortUrl });

    return urlRecordRawEntity;
  }

  public async truncate(): Promise<void> {
    await urlRecordRawEntityModel.deleteMany();
  }
}
