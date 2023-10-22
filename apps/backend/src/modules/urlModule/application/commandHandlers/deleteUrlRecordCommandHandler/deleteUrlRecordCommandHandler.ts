import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface DeleteUrlRecordCommandHandlerPayload {
  readonly urlRecordId: string;
}

export type DeleteUrlRecordCommandHandler = CommandHandler<DeleteUrlRecordCommandHandlerPayload, void>;
