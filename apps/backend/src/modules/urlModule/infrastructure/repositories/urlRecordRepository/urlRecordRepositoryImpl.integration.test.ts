import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { RepositoryError } from '../../../../../common/errors/common/repositoryError.js';
import { Application } from '../../../../../core/application.js';
import { type PostgresDatabaseClient } from '../../../../../core/database/postgresDatabaseClient/postgresDatabaseClient.js';
import { coreSymbols } from '../../../../../core/symbols.js';
import { type UrlRecordRepository } from '../../../domain/repositories/urlRecordRepository/urlRecordRepository.js';
import { symbols } from '../../../symbols.js';
import { UrlRecordRawEntityTestFactory } from '../../../tests/factories/urlRecordRawEntityTestFactory/urlRecordRawEntityTestFactory.js';
import { UrlRecordTestUtils } from '../../../tests/utils/urlRecordTestUtils/urlRecordTestUtils.js';
import { type UrlRecordRawEntity } from '../../databases/urlDatabase/tables/urlRecordTable/urlRecordRawEntity.js';

describe('UrlRecordRepositoryImpl', () => {
  let urlRecordRepository: UrlRecordRepository;

  let postgresDatabaseClient: PostgresDatabaseClient;

  let urlRecordTestUtils: UrlRecordTestUtils;

  const urlRecordEntityTestFactory = new UrlRecordRawEntityTestFactory();

  beforeEach(async () => {
    const container = Application.createContainer();

    urlRecordRepository = container.get<UrlRecordRepository>(symbols.urlRecordRepository);

    postgresDatabaseClient = container.get<PostgresDatabaseClient>(coreSymbols.postgresDatabaseClient);

    urlRecordTestUtils = new UrlRecordTestUtils(postgresDatabaseClient);

    await urlRecordTestUtils.truncate();
  });

  afterEach(async () => {
    await urlRecordTestUtils.truncate();

    await postgresDatabaseClient.destroy();
  });

  describe('create', () => {
    it('creates an UrlRecord', async () => {
      const { longUrl, shortUrl } = urlRecordEntityTestFactory.create();

      const urlRecord = await urlRecordRepository.create({
        longUrl,
        shortUrl,
      });

      const foundUrlRecord = (await urlRecordTestUtils.findByShortUrl({ shortUrl })) as UrlRecordRawEntity;

      expect(foundUrlRecord).toBeDefined();

      expect(foundUrlRecord).toMatchObject({
        id: expect.any(String),
        createdAt: expect.any(Date),
        shortUrl,
        longUrl,
      });

      expect(urlRecord.getId()).toEqual(foundUrlRecord.id);

      expect(urlRecord.getCreatedAt()).toEqual(foundUrlRecord.createdAt);

      expect(urlRecord.getShortUrl()).toEqual(foundUrlRecord.shortUrl);

      expect(urlRecord.getLongUrl()).toEqual(foundUrlRecord.longUrl);
    });

    it('throws an error when UrlRecord with the same email already exists', async () => {
      const existingUrlRecord = urlRecordEntityTestFactory.create();

      await urlRecordTestUtils.persist({ urlRecord: existingUrlRecord });

      try {
        await urlRecordRepository.create({
          longUrl: existingUrlRecord.longUrl,
          shortUrl: existingUrlRecord.shortUrl,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(RepositoryError);

        return;
      }

      expect.fail();
    });
  });

  describe('find', () => {
    it('finds UrlRecord by short url', async () => {
      const urlRecord = urlRecordEntityTestFactory.create();

      await urlRecordTestUtils.persist({ urlRecord });

      const foundUrlRecord = await urlRecordRepository.find({ shortUrl: urlRecord.shortUrl });

      expect(foundUrlRecord).not.toBeNull();
    });

    it('returns null if UrlRecord with given short url does not exist', async () => {
      const { shortUrl } = urlRecordEntityTestFactory.create();

      const foundUrlRecord = await urlRecordRepository.find({ shortUrl });

      expect(foundUrlRecord).toBeNull();
    });

    it('finds UrlRecord by long url', async () => {
      const urlRecord = urlRecordEntityTestFactory.create();

      await urlRecordTestUtils.persist({ urlRecord });

      const foundUrlRecord = await urlRecordRepository.find({ longUrl: urlRecord.longUrl });

      expect(foundUrlRecord).not.toBeNull();
    });

    it('returns null if UrlRecord with given long url does not exist', async () => {
      const { longUrl } = urlRecordEntityTestFactory.create();

      const foundUrlRecord = await urlRecordRepository.find({ longUrl });

      expect(foundUrlRecord).toBeNull();
    });
  });

  describe('findById', () => {
    it('finds UrlRecord by id', async () => {
      const urlRecord = urlRecordEntityTestFactory.create();

      await urlRecordTestUtils.persist({ urlRecord });

      const foundUrlRecord = await urlRecordRepository.findById({ id: urlRecord.id });

      expect(foundUrlRecord).not.toBeNull();
    });

    it('throws an error if UrlRecord with given id does not exist', async () => {
      const { id } = urlRecordEntityTestFactory.create();

      const foundUrlRecord = await urlRecordRepository.findById({ id });

      expect(foundUrlRecord).toBeNull();
    });
  });
});
