import mongoose from 'mongoose';
import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { type CreateUrlRecordCommandHandler } from './createUrlRecordCommandHandler.js';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/common/resourceAlreadyExistsError.js';
import { Application } from '../../../../../core/application.js';
import { symbols } from '../../../symbols.js';
import { UrlRecordRawEntityTestFactory } from '../../../tests/factories/urlRecordRawEntityTestFactory/urlRecordRawEntityTestFactory.js';
import { UrlRecordTestUtils } from '../../../tests/utils/urlRecordTestUtils/urlRecordTestUtils.js';

describe('CreateUrlRecordCommandHandler', () => {
  let createUrlRecordCommandHandler: CreateUrlRecordCommandHandler;

  let urlRecordTestUtils: UrlRecordTestUtils;

  const urlRecordRawEntityTestFactory = new UrlRecordRawEntityTestFactory();

  beforeEach(async () => {
    const container = Application.createContainer();

    createUrlRecordCommandHandler = container.get<CreateUrlRecordCommandHandler>(symbols.createUrlRecordCommandHandler);

    urlRecordTestUtils = new UrlRecordTestUtils();

    await mongoose.connect('mongodb://localhost:27017/', { dbName: 'test' });

    await urlRecordTestUtils.truncate();
  });

  afterEach(async () => {
    await urlRecordTestUtils.truncate();

    await mongoose.disconnect();
  });

  it('creates an UrlRecord', async () => {
    const { longUrl } = urlRecordRawEntityTestFactory.create();

    const { urlRecord } = await createUrlRecordCommandHandler.execute({
      longUrl,
    });

    const foundUrlRecord = await urlRecordTestUtils.findById({ id: urlRecord.getId() });

    expect(foundUrlRecord).not.toBeNull();

    expect(foundUrlRecord?.longUrl).toEqual(longUrl);
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