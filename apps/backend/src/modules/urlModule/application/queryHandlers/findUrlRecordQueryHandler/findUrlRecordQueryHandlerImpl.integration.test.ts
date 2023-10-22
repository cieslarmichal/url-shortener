import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { type FindUrlRecordQueryHandler } from './findUrlRecordQueryHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/common/resourceNotFoundError.js';
import { Application } from '../../../../../core/application.js';
import { type PostgresDatabaseClient } from '../../../../../core/database/postgresDatabaseClient/postgresDatabaseClient.js';
import { coreSymbols } from '../../../../../core/symbols.js';
import { symbols } from '../../../symbols.js';
import { UrlRecordRawEntityTestFactory } from '../../../tests/factories/urlRecordRawEntityTestFactory/urlRecordRawEntityTestFactory.js';
import { UrlRecordTestUtils } from '../../../tests/utils/urlRecordTestUtils/urlRecordTestUtils.js';

describe('FindUrlRecordQueryHandler', () => {
  let findUrlRecordQueryHandler: FindUrlRecordQueryHandler;

  let postgresDatabaseClient: PostgresDatabaseClient;

  let urlRecordTestUtils: UrlRecordTestUtils;

  const urlRecordEntityTestFactory = new UrlRecordRawEntityTestFactory();

  beforeEach(async () => {
    const container = Application.createContainer();

    findUrlRecordQueryHandler = container.get<FindUrlRecordQueryHandler>(symbols.findUrlRecordQueryHandler);

    postgresDatabaseClient = container.get<PostgresDatabaseClient>(coreSymbols.postgresDatabaseClient);

    urlRecordTestUtils = new UrlRecordTestUtils(postgresDatabaseClient);

    await urlRecordTestUtils.truncate();
  });

  afterEach(async () => {
    await urlRecordTestUtils.truncate();

    await postgresDatabaseClient.destroy();
  });

  it('finds urlRecord by id', async () => {
    const urlRecord = urlRecordEntityTestFactory.create();

    await urlRecordTestUtils.persist({ urlRecord });

    const { urlRecord: foundUrlRecord } = await findUrlRecordQueryHandler.execute({ urlRecordId: urlRecord.id });

    expect(foundUrlRecord).not.toBeNull();
  });

  it('throws an error if urlRecord with given id does not exist', async () => {
    const { id } = urlRecordEntityTestFactory.create();

    try {
      await findUrlRecordQueryHandler.execute({ urlRecordId: id });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceNotFoundError);

      return;
    }

    expect.fail();
  });
});
