import {
  type RegisterUrlRecordCommandHandler,
  type RegisterUrlRecordCommandHandlerPayload,
  type RegisterUrlRecordCommandHandlerResult,
} from './registerUrlRecordCommandHandler.js';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/common/resourceAlreadyExistsError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type UuidService } from '../../../../../libs/uuid/services/uuidService/uuidService.js';
import { type UrlRecordRepository } from '../../repositories/urlRecordRepository/urlRecordRepository.js';
import { type HashService } from '../../services/hashService/hashService.js';

export class RegisterUrlRecordCommandHandlerImpl implements RegisterUrlRecordCommandHandler {
  public constructor(
    private readonly urlRecordRepository: UrlRecordRepository,
    private readonly hashService: HashService,
    private readonly uuidService: UuidService,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: RegisterUrlRecordCommandHandlerPayload): Promise<RegisterUrlRecordCommandHandlerResult> {
    const { email, password } = payload;

    this.loggerService.debug({
      message: 'Registering urlRecord...',
      context: { email },
    });

    const existingUrlRecord = await this.urlRecordRepository.findUrlRecord({ email });

    if (existingUrlRecord) {
      throw new ResourceAlreadyExistsError({
        name: 'urlRecord',
        email,
      });
    }

    const hashedPassword = await this.hashService.hash(password);

    const urlRecord = await this.urlRecordRepository.createUrlRecord({
      id: this.uuidService.generateUuid(),
      email,
      password: hashedPassword,
    });

    this.loggerService.info({
      message: 'UrlRecord registered.',
      context: {
        email,
        urlRecordId: urlRecord.id,
      },
    });

    return { urlRecord };
  }
}
