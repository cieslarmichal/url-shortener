import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { type FindLongUrlQueryHandler } from './findLongUrlQueryHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/common/resourceNotFoundError.js';
import { Application } from '../../../../../core/application.js';
import { type PostgresDatabaseClient } from '../../../../../core/database/postgresDatabaseClient/postgresDatabaseClient.js';
import { coreSymbols } from '../../../../../core/symbols.js';
import { symbols } from '../../../symbols.js';
import { UrlRecordRawEntityTestFactory } from '../../../tests/factories/urlRecordRawEntityTestFactory/urlRecordRawEntityTestFactory.js';
import { UrlRecordTestUtils } from '../../../tests/utils/urlRecordTestUtils/urlRecordTestUtils.js';

describe('FindLongUrlQueryHandler', () => {
  let findLongUrlQueryHandler: FindLongUrlQueryHandler;

  let postgresDatabaseClient: PostgresDatabaseClient;

  let urlRecordTestUtils: UrlRecordTestUtils;

  const urlRecordEntityTestFactory = new UrlRecordRawEntityTestFactory();

  beforeEach(async () => {
    const container = Application.createContainer();

    findLongUrlQueryHandler = container.get<FindLongUrlQueryHandler>(symbols.findUrlRecordQueryHandler);

    postgresDatabaseClient = container.get<PostgresDatabaseClient>(coreSymbols.postgresDatabaseClient);

    urlRecordTestUtils = new UrlRecordTestUtils(postgresDatabaseClient);

    await urlRecordTestUtils.truncate();
  });

  afterEach(async () => {
    await urlRecordTestUtils.truncate();

    await postgresDatabaseClient.destroy();
  });

  it('finds UrlRecord by long url', async () => {
    const urlRecord = urlRecordEntityTestFactory.create();

    await urlRecordTestUtils.persist({ urlRecord });

    const { longUrl } = await findLongUrlQueryHandler.execute({ shortUrl: urlRecord.shortUrl });

    expect(longUrl).toEqual(urlRecord.longUrl);
  });

  it('throws an error if UrlRecord with given long url does not exist', async () => {
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
