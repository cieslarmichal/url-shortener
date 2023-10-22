import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { type RegisterUrlRecordCommandHandler } from './registerUrlRecordCommandHandler.js';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/common/resourceAlreadyExistsError.js';
import { Application } from '../../../../../core/application.js';
import { type PostgresDatabaseClient } from '../../../../../core/database/postgresDatabaseClient/postgresDatabaseClient.js';
import { coreSymbols } from '../../../../../core/symbols.js';
import { type UrlRecordRepository } from '../../../domain/repositories/urlRecordRepository/urlRecordRepository.js';
import { symbols } from '../../../symbols.js';
import { UrlRecordRawEntityTestFactory } from '../../../tests/factories/urlRecordRawEntityTestFactory/urlRecordRawEntityTestFactory.js';
import { UrlRecordTestUtils } from '../../../tests/utils/urlRecordTestUtils/urlRecordTestUtils.js';

describe('RegisterUrlRecordCommandHandler', () => {
  let urlRecordRepository: UrlRecordRepository;

  let postgresDatabaseClient: PostgresDatabaseClient;

  let urlRecordTestUtils: UrlRecordTestUtils;

  const urlRecordEntityTestFactory = new UrlRecordRawEntityTestFactory();

  beforeEach(async () => {
    const container = Application.createContainer();

    urlRecordRepository = container.get<RegisterUrlRecordCommandHandler>(symbols.urlRecordRepository);

    postgresDatabaseClient = container.get<PostgresDatabaseClient>(coreSymbols.postgresDatabaseClient);

    urlRecordTestUtils = new UrlRecordTestUtils(postgresDatabaseClient);

    await urlRecordTestUtils.truncate();
  });

  afterEach(async () => {
    await urlRecordTestUtils.truncate();

    await postgresDatabaseClient.destroy();
  });

  describe('create', () => {
    it('creates a urlRecord', async () => {
      const { email, password } = urlRecordEntityTestFactory.create();

      const { urlRecord } = await urlRecordRepository.execute({
        email: email as string,
        password,
      });

      const foundUrlRecord = await urlRecordTestUtils.findByEmail({ email });

      expect(urlRecord.email).toEqual(email);

      expect(foundUrlRecord).toBeDefined();
    });

    it('throws an error when urlRecord with the same email already exists', async () => {
      const existingUrlRecord = urlRecordEntityTestFactory.create();

      await urlRecordTestUtils.persist({ urlRecord: existingUrlRecord });

      try {
        await urlRecordRepository.execute({
          email: existingUrlRecord.email,
          password: existingUrlRecord.password,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ResourceAlreadyExistsError);

        return;
      }

      expect.fail();
    });
  });

  describe('find', () => {
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
});
