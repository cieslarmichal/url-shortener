import {
  type FindUrlRecordQueryHandler,
  type FindUrlRecordQueryHandlerPayload,
  type FindUrlRecordQueryHandlerResult,
} from './findUrlRecordQueryHandler.js';
import { ResourceNotFoundError } from '../../../../../common/errors/common/resourceNotFoundError.js';
import { type UrlRecordRepository } from '../../repositories/urlRecordRepository/urlRecordRepository.js';

export class FindUrlRecordQueryHandlerImpl implements FindUrlRecordQueryHandler {
  public constructor(private readonly urlRecordRepository: UrlRecordRepository) {}

  public async execute(payload: FindUrlRecordQueryHandlerPayload): Promise<FindUrlRecordQueryHandlerResult> {
    const { urlRecordId } = payload;

    const urlRecord = await this.urlRecordRepository.findUrlRecord({ id: urlRecordId });

    if (!urlRecord) {
      throw new ResourceNotFoundError({
        name: 'urlRecord',
        id: urlRecordId,
      });
    }

    return { urlRecord };
  }
}
