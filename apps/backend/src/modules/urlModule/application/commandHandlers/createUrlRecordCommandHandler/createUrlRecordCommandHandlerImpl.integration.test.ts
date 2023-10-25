import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { type CreateUrlRecordCommandHandlerImpl } from './createUrlRecordCommandHandlerImpl.js';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/common/resourceAlreadyExistsError.js';
import { Application } from '../../../../../core/application.js';
import { symbols } from '../../../symbols.js';
import { UrlRecordRawEntityTestFactory } from '../../../tests/factories/urlRecordRawEntityTestFactory/urlRecordRawEntityTestFactory.js';
import { MongoDbTestUtils } from '../../../tests/utils/mongoDbTestUtils/mongoDbTestUtils.js';
import { UrlRecordTestUtils } from '../../../tests/utils/urlRecordTestUtils/urlRecordTestUtils.js';

describe('CreateUrlRecordCommandHandler', () => {
  let createUrlRecordCommandHandler: CreateUrlRecordCommandHandlerImpl;

  const urlRecordTestUtils = new UrlRecordTestUtils();

  const mongoDbTestUtils = new MongoDbTestUtils();

  const urlRecordRawEntityTestFactory = new UrlRecordRawEntityTestFactory();

  beforeEach(async () => {
    const container = Application.createContainer();

    createUrlRecordCommandHandler = container.get<CreateUrlRecordCommandHandlerImpl>(
      symbols.createUrlRecordCommandHandler,
    );

    await mongoDbTestUtils.connect();

    await urlRecordTestUtils.truncate();
  });

  afterEach(async () => {
    await urlRecordTestUtils.truncate();

    await mongoDbTestUtils.disconnect();
  });

  it('creates an UrlRecord', async () => {
    const { longUrl } = urlRecordRawEntityTestFactory.create();

    const x = await createUrlRecordCommandHandler.getShortUrlPathParam(longUrl);

    console.log(x);

    const y = await createUrlRecordCommandHandler.getShortUrlPathParam(longUrl + '38a17ds4c');

    console.log(y);

    // const { urlRecord } = await createUrlRecordCommandHandler.execute({
    //   longUrl,
    // });

    // const foundUrlRecord = await urlRecordTestUtils.findById({ id: urlRecord.getId() });

    // expect(foundUrlRecord).not.toBeNull();

    // expect(foundUrlRecord?.longUrl).toEqual(longUrl);
  });

  it('throws an error - when UrlRecord with the same url already exists', async () => {
    const urlRecord = await urlRecordTestUtils.createAndPersist();

    try {
      await createUrlRecordCommandHandler.execute({
        longUrl: urlRecord.longUrl,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceAlreadyExistsError);

      return;
    }

    expect.fail();
  });
});
