import { type CommandHandler } from '../../../../../common/types/commandHandler.js';

export interface LoginUrlRecordCommandHandlerPayload {
  readonly email: string;
  readonly password: string;
}

export interface LoginUrlRecordCommandHandlerResult {
  readonly accessToken: string;
}

export type LoginUrlRecordCommandHandler = CommandHandler<LoginUrlRecordCommandHandlerPayload, LoginUrlRecordCommandHandlerResult>;
