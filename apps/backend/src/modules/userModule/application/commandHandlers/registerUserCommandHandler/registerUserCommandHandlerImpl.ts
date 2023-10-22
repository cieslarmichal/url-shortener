import {
  type RegisterUserCommandHandler,
  type RegisterUserCommandHandlerPayload,
  type RegisterUserCommandHandlerResult,
} from './registerUserCommandHandler.js';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/common/resourceAlreadyExistsError.js';
import { type LoggerService } from '../../../../../libs/logger/services/loggerService/loggerService.js';
import { type UuidService } from '../../../../../libs/uuid/services/uuidService/uuidService.js';
import { type UserRepository } from '../../repositories/userRepository/userRepository.js';
import { type HashService } from '../../services/hashService/hashService.js';

export class RegisterUserCommandHandlerImpl implements RegisterUserCommandHandler {
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly hashService: HashService,
    private readonly uuidService: UuidService,
    private readonly loggerService: LoggerService,
  ) {}

  public async execute(payload: RegisterUserCommandHandlerPayload): Promise<RegisterUserCommandHandlerResult> {
    const { email, password } = payload;

    this.loggerService.debug({
      message: 'Registering user...',
      context: { email },
    });

    const existingUser = await this.userRepository.findUser({ email });

    if (existingUser) {
      throw new ResourceAlreadyExistsError({
        name: 'user',
        email,
      });
    }

    const hashedPassword = await this.hashService.hash(password);

    const user = await this.userRepository.createUser({
      id: this.uuidService.generateUuid(),
      email,
      password: hashedPassword,
    });

    this.loggerService.info({
      message: 'User registered.',
      context: {
        email,
        userId: user.id,
      },
    });

    return { user };
  }
}
