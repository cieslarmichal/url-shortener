import { type CommandHandler } from '../../../../../common/types/commandHandler.js';
import { type UrlRecord } from '../../../domain/entities/urlRecord/urlRecord.js';

export interface RegisterUrlRecordCommandHandlerPayload {
  readonly email: string;
  readonly password: string;
}

export interface RegisterUrlRecordCommandHandlerResult {
  readonly urlRecord: UrlRecord;
}

export type RegisterUrlRecordCommandHandler = CommandHandler<
  RegisterUrlRecordCommandHandlerPayload,
  RegisterUrlRecordCommandHandlerResult
>;
