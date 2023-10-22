import { beforeEach, afterEach, expect, describe, it } from 'vitest';

import { type DeleteUrlRecordCommandHandler } from './deleteUrlRecordCommandHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/common/resourceNotFoundError.js';
import { Application } from '../../../../../core/application.js';
import { type PostgresDatabaseClient } from '../../../../../core/database/postgresDatabaseClient/postgresDatabaseClient.js';
import { coreSymbols } from '../../../../../core/symbols.js';
import { symbols } from '../../../symbols.js';
import { UrlRecordRawEntityTestFactory } from '../../../tests/factories/urlRecordRawEntityTestFactory/urlRecordRawEntityTestFactory.js';
import { UrlRecordTestUtils } from '../../../tests/utils/urlRecordTestUtils/urlRecordTestUtils.js';

describe('DeleteUrlRecordCommandHandler', () => {
  let deleteUrlRecordCommandHandler: DeleteUrlRecordCommandHandler;

  let postgresDatabaseClient: PostgresDatabaseClient;

  let urlRecordTestUtils: UrlRecordTestUtils;

  const urlRecordEntityTestFactory = new UrlRecordRawEntityTestFactory();

  beforeEach(async () => {
    const container = Application.createContainer();

    deleteUrlRecordCommandHandler = container.get<DeleteUrlRecordCommandHandler>(symbols.deleteUrlRecordCommandHandler);

    postgresDatabaseClient = container.get<PostgresDatabaseClient>(coreSymbols.postgresDatabaseClient);

    urlRecordTestUtils = new UrlRecordTestUtils(postgresDatabaseClient);

    await urlRecordTestUtils.truncate();
  });

  afterEach(async () => {
    await urlRecordTestUtils.truncate();

    await postgresDatabaseClient.destroy();
  });

  it('deletes urlRecord', async () => {
    const urlRecord = urlRecordEntityTestFactory.create();

    await urlRecordTestUtils.persist({ urlRecord });

    await deleteUrlRecordCommandHandler.execute({ urlRecordId: urlRecord.id });

    const foundUrlRecord = await urlRecordTestUtils.findById({ id: urlRecord.id });

    expect(foundUrlRecord).toBeUndefined();
  });

  it('throws an error if urlRecord with given id does not exist', async () => {
    const { id } = urlRecordEntityTestFactory.create();

    try {
      await deleteUrlRecordCommandHandler.execute({ urlRecordId: id });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceNotFoundError);

      return;
    }

    expect.fail();
  });
});
