import mongoose from 'mongoose';
import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { type FindLongUrlQueryHandler } from './findLongUrlQueryHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/common/resourceNotFoundError.js';
import { Application } from '../../../../../core/application.js';
import { symbols } from '../../../symbols.js';
import { UrlRecordRawEntityTestFactory } from '../../../tests/factories/urlRecordRawEntityTestFactory/urlRecordRawEntityTestFactory.js';
import { UrlRecordTestUtils } from '../../../tests/utils/urlRecordTestUtils/urlRecordTestUtils.js';

describe('FindLongUrlQueryHandler', () => {
  let findLongUrlQueryHandler: FindLongUrlQueryHandler;

  const urlRecordTestUtils = new UrlRecordTestUtils();

  const urlRecordEntityTestFactory = new UrlRecordRawEntityTestFactory();

  beforeEach(async () => {
    const container = Application.createContainer();

    findLongUrlQueryHandler = container.get<FindLongUrlQueryHandler>(symbols.findUrlRecordQueryHandler);

    await mongoose.connect('mongodb://localhost:27017/', { dbName: 'test' });

    await urlRecordTestUtils.truncate();
  });

  afterEach(async () => {
    await urlRecordTestUtils.truncate();

    await mongoose.disconnect();
  });

  it('finds UrlRecord by long url', async () => {
    const urlRecord = await urlRecordTestUtils.createAndPersist();

    const { longUrl } = await findLongUrlQueryHandler.execute({ shortUrl: urlRecord.shortUrl });

    expect(longUrl).toEqual(urlRecord.longUrl);
  });

  it('throws an error if UrlRecord with given short url does not exist', async () => {
    const { shortUrl } = urlRecordEntityTestFactory.create();

    try {
      await findLongUrlQueryHandler.execute({ shortUrl });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceNotFoundError);

      return;
    }

    expect.fail();
  });
});