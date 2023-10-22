import { type QueryHandler } from '../../../../../common/types/queryHandler.js';
import { type UrlRecord } from '../../../domain/entities/urlRecord/urlRecord.js';

export interface FindUrlRecordQueryHandlerPayload {
  readonly urlRecordId: string;
}

export interface FindUrlRecordQueryHandlerResult {
  readonly urlRecord: UrlRecord;
}

export type FindUrlRecordQueryHandler = QueryHandler<FindUrlRecordQueryHandlerPayload, FindUrlRecordQueryHandlerResult>;
