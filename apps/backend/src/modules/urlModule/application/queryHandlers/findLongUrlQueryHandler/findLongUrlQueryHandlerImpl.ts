import { type FindLongUrlQueryHandler, type ExecutePayload, type ExecuteResult } from './findLongUrlQueryHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/common/resourceNotFoundError.js';
import { type UrlRecordRepository } from '../../../domain/repositories/urlRecordRepository/urlRecordRepository.js';

export class FindLongUrlQueryHandlerImpl implements FindLongUrlQueryHandler {
  public constructor(private readonly urlRecordRepository: UrlRecordRepository) {}

  public async execute(payload: ExecutePayload): Promise<ExecuteResult> {
    const { shortUrl } = payload;

    const urlRecord = await this.urlRecordRepository.find({ shortUrl });

    if (!urlRecord) {
      throw new ResourceNotFoundError({
        name: 'UrlRecord',
        shortUrl,
      });
    }

    return { longUrl: urlRecord.getLongUrl() };
  }
}
