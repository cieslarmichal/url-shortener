import { beforeEach, afterEach, expect, it, describe } from 'vitest';

import { type LoginUrlRecordCommandHandler } from './loginUrlRecordCommandHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/common/resourceNotFoundError.js';
import { Application } from '../../../../../core/application.js';
import { type PostgresDatabaseClient } from '../../../../../core/database/postgresDatabaseClient/postgresDatabaseClient.js';
import { coreSymbols } from '../../../../../core/symbols.js';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.js';
import { authSymbols } from '../../../../authModule/symbols.js';
import { symbols } from '../../../symbols.js';
import { UrlRecordRawEntityTestFactory } from '../../../tests/factories/urlRecordRawEntityTestFactory/urlRecordRawEntityTestFactory.js';
import { UrlRecordTestUtils } from '../../../tests/utils/urlRecordTestUtils/urlRecordTestUtils.js';
import { type HashService } from '../../services/hashService/hashService.js';

describe('LoginUrlRecordCommandHandler', () => {
  let loginUrlRecordCommandHandler: LoginUrlRecordCommandHandler;

  let postgresDatabaseClient: PostgresDatabaseClient;

  let urlRecordTestUtils: UrlRecordTestUtils;

  let tokenService: TokenService;

  let hashService: HashService;

  const urlRecordEntityTestFactory = new UrlRecordRawEntityTestFactory();

  beforeEach(async () => {
    const container = Application.createContainer();

    loginUrlRecordCommandHandler = container.get<LoginUrlRecordCommandHandler>(symbols.loginUrlRecordCommandHandler);

    tokenService = container.get<TokenService>(authSymbols.tokenService);

    hashService = container.get<HashService>(symbols.hashService);

    postgresDatabaseClient = container.get<PostgresDatabaseClient>(coreSymbols.postgresDatabaseClient);

    urlRecordTestUtils = new UrlRecordTestUtils(postgresDatabaseClient);

    await urlRecordTestUtils.truncate();
  });

  afterEach(async () => {
    await urlRecordTestUtils.truncate();

    await postgresDatabaseClient.destroy();
  });

  it('returns access token', async () => {
    const { id, email, password } = urlRecordEntityTestFactory.create();

    const hashedPassword = await hashService.hash(password);

    await urlRecordTestUtils.persist({
      urlRecord: {
        id,
        email,
        password: hashedPassword,
      },
    });

    const { accessToken } = await loginUrlRecordCommandHandler.execute({
      email,
      password,
    });

    const tokenPayload = tokenService.verifyToken(accessToken);

    expect(tokenPayload['urlRecordId']).toBe(id);
  });

  it('throws an error if urlRecord with given email does not exist', async () => {
    const { email, password } = urlRecordEntityTestFactory.create();

    try {
      await loginUrlRecordCommandHandler.execute({
        email,
        password,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceNotFoundError);

      return;
    }

    expect.fail();
  });

  it('throws an error if urlRecord password does not match stored password', async () => {
    const { id, email, password } = urlRecordEntityTestFactory.create();

    await urlRecordTestUtils.persist({
      urlRecord: {
        id,
        email,
        password,
      },
    });

    try {
      await loginUrlRecordCommandHandler.execute({
        email,
        password,
      });
    } catch (error) {
      expect(error).toBeInstanceOf(ResourceNotFoundError);

      return;
    }

    expect.fail();
  });
});
