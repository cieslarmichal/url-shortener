import {
  CreateUrlRecordCommandHandler,
  type ExecutePayload,
  type ExecuteResult,
} from './createUrlRecordCommandHandler.js';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/common/resourceAlreadyExistsError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type UuidService } from '../../../../../libs/uuid/services/uuidService/uuidService.js';
import { type UrlRecordRepository } from '../../../domain/repositories/urlRecordRepository/urlRecordRepository.js';
import { type HashService } from '../../services/hashService/hashService.js';
import { UrlModuleConfig } from '../../../urlModuleConfig.js';

export class CreateUrlRecordCommandHandlerImpl implements CreateUrlRecordCommandHandler {
  public constructor(
    private readonly urlRecordRepository: UrlRecordRepository,
    private readonly hashService: HashService,
    private readonly loggerService: LoggerService,
    private readonly config: UrlModuleConfig,
  ) {}

  public async execute(payload: ExecutePayload): Promise<ExecuteResult> {
    const { longUrl } = payload;

    this.loggerService.debug({ message: 'Creating UrlRecord...',context: { longUrl }});

    const existingUrlRecord = await this.urlRecordRepository.find({ longUrl });

    if (existingUrlRecord) {
      throw new ResourceAlreadyExistsError({
        name: 'UrlRecord',
        longUrl,
      });
    }

    const hash = await this.hashService.hash(longUrl);

    const urlRecord = await this.urlRecordRepository.create({
      email,
      password: hashedPassword,
    });

    this.loggerService.info({
      message: 'UrlRecord created.',
      context: {
        email,
        urlRecordId: urlRecord.id,
        longUrl: urlRecord,
      },
    });

    return { urlRecord };
  }

  private async findAvailableShortUrl
}
