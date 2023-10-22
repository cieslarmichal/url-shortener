import { type DeleteUrlRecordCommandHandler, type DeleteUrlRecordCommandHandlerPayload } from './deleteUrlRecordCommandHandler.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type UrlRecordRepository } from '../../repositories/urlRecordRepository/urlRecordRepository.js';

export class DeleteUrlRecordCommandHandlerImpl implements DeleteUrlRecordCommandHandler {
  public constructor(
    private readonly urlRecordRepository: UrlRecordRepository,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: DeleteUrlRecordCommandHandlerPayload): Promise<void> {
    const { urlRecordId } = payload;

    this.loggerService.debug({
      message: 'Deleting urlRecord...',
      context: { urlRecordId },
    });

    await this.urlRecordRepository.deleteUrlRecord({ id: urlRecordId });

    this.loggerService.info({
      message: 'UrlRecord deleted.',
      context: { urlRecordId },
    });
  }
}
