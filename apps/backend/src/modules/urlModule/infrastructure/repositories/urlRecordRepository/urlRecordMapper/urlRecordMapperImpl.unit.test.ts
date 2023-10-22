import { beforeEach, expect, describe, it } from 'vitest';

import { UrlRecordMapperImpl } from './urlRecordMapperImpl.js';
import { UrlRecordRawEntityTestFactory } from '../../../../tests/factories/urlRecordRawEntityTestFactory/urlRecordRawEntityTestFactory.js';

describe('UrlRecordMapperImpl', () => {
  let urlRecordMapperImpl: UrlRecordMapperImpl;

  const urlRecordEntityTestFactory = new UrlRecordRawEntityTestFactory();

  beforeEach(async () => {
    urlRecordMapperImpl = new UrlRecordMapperImpl();
  });

  it('maps from urlRecord raw entity to domain urlRecord', async () => {
    const urlRecordEntity = urlRecordEntityTestFactory.create();

    const urlRecord = urlRecordMapperImpl.mapToDomain(urlRecordEntity);

    expect(urlRecord).toEqual({
      id: urlRecordEntity.id,
      email: urlRecordEntity.email,
      password: urlRecordEntity.password,
    });
  });
});
