import {
  type LoginUrlRecordCommandHandler,
  type LoginUrlRecordCommandHandlerPayload,
  type LoginUrlRecordCommandHandlerResult,
} from './loginUrlRecordCommandHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/common/resourceNotFoundError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type TokenService } from '../../../../authModule/application/services/tokenService/tokenService.js';
import { type UrlRecordRepository } from '../../repositories/urlRecordRepository/urlRecordRepository.js';
import { type HashService } from '../../services/hashService/hashService.js';

export class LoginUrlRecordCommandHandlerImpl implements LoginUrlRecordCommandHandler {
  public constructor(
    private readonly urlRecordRepository: UrlRecordRepository,
    private readonly loggerService: LoggerService,
    private readonly hashService: HashService,
    private readonly tokenService: TokenService,
  ) {}

  public async execute(payload: LoginUrlRecordCommandHandlerPayload): Promise<LoginUrlRecordCommandHandlerResult> {
    const { email, password } = payload;

    this.loggerService.debug({
      message: 'Logging urlRecord in...',
      context: { email },
    });

    const urlRecord = await this.urlRecordRepository.findUrlRecord({ email });

    if (!urlRecord) {
      throw new ResourceNotFoundError({
        name: 'urlRecord',
        email,
      });
    }

    const passwordIsValid = await this.hashService.compare(password, urlRecord.password);

    if (!passwordIsValid) {
      throw new ResourceNotFoundError({
        name: 'urlRecord',
        email,
      });
    }

    const accessToken = this.tokenService.createToken({ urlRecordId: urlRecord.id });

    this.loggerService.info({
      message: 'UrlRecord logged in.',
      context: {
        email,
        urlRecordId: urlRecord.id,
        accessToken,
      },
    });

    return { accessToken };
  }
}
