import { UrlHttpController } from './api/httpControllers/urlHttpController/urlHttpController.js';
import { type CreateUrlRecordCommandHandler } from './application/commandHandlers/createUrlRecordCommandHandler/createUrlRecordCommandHandler.js';
import { CreateUrlRecordCommandHandlerImpl } from './application/commandHandlers/createUrlRecordCommandHandler/createUrlRecordCommandHandlerImpl.js';
import { type FindLongUrlQueryHandler } from './application/queryHandlers/findLongUrlQueryHandler/findLongUrlQueryHandler.js';
import { FindLongUrlQueryHandlerImpl } from './application/queryHandlers/findLongUrlQueryHandler/findLongUrlQueryHandlerImpl.js';
import { type HashService } from './application/services/hashService/hashService.js';
import { HashServiceImpl } from './application/services/hashService/hashServiceImpl.js';
import { type UrlRecordRepository } from './domain/repositories/urlRecordRepository/urlRecordRepository.js';
import { type UrlRecordMapper } from './infrastructure/repositories/urlRecordRepository/urlRecordMapper/urlRecordMapper.js';
import { UrlRecordMapperImpl } from './infrastructure/repositories/urlRecordRepository/urlRecordMapper/urlRecordMapperImpl.js';
import { UrlRecordRepositoryImpl } from './infrastructure/repositories/urlRecordRepository/urlRecordRepositoryImpl.js';
import { symbols } from './symbols.js';
import { type UrlModuleConfig } from './urlModuleConfig.js';
import { coreSymbols } from '../../core/symbols.js';
import { type DependencyInjectionContainer } from '../../libs/dependencyInjection/dependencyInjectionContainer.js';
import { type DependencyInjectionModule } from '../../libs/dependencyInjection/dependencyInjectionModule.js';
import { type LoggerService } from '../../libs/logger/services/loggerService/loggerService.js';
import { type UuidService } from '../../libs/uuid/services/uuidService/uuidService.js';

export class UrlModule implements DependencyInjectionModule {
  public constructor(private readonly config: UrlModuleConfig) {}

  public declareBindings(container: DependencyInjectionContainer): void {
    container.bindToValue<UrlModuleConfig>(symbols.urlModuleConfig, this.config);

    container.bind<UrlRecordMapper>(symbols.urlRecordMapper, () => new UrlRecordMapperImpl());

    container.bind<UrlRecordRepository>(
      symbols.urlRecordRepository,
      () =>
        new UrlRecordRepositoryImpl(
          container.get<UrlRecordMapper>(symbols.urlRecordMapper),
          container.get<UuidService>(coreSymbols.uuidService),
        ),
    );

    container.bind<HashService>(
      symbols.hashService,
      () => new HashServiceImpl(container.get<UrlModuleConfig>(symbols.urlModuleConfig)),
    );

    container.bind<CreateUrlRecordCommandHandler>(
      symbols.createUrlRecordCommandHandler,
      () =>
        new CreateUrlRecordCommandHandlerImpl(
          container.get<UrlRecordRepository>(symbols.urlRecordRepository),
          container.get<HashService>(symbols.hashService),
          container.get<LoggerService>(coreSymbols.loggerService),
          container.get<UrlModuleConfig>(symbols.urlModuleConfig),
        ),
    );

    container.bind<FindLongUrlQueryHandler>(
      symbols.findLongUrlQueryHandler,
      () => new FindLongUrlQueryHandlerImpl(container.get<UrlRecordRepository>(symbols.urlRecordRepository)),
    );

    container.bind<UrlHttpController>(
      symbols.urlHttpController,
      () =>
        new UrlHttpController(
          container.get<CreateUrlRecordCommandHandler>(symbols.createUrlRecordCommandHandler),
          container.get<FindLongUrlQueryHandler>(symbols.findLongUrlQueryHandler),
          container.get<UrlModuleConfig>(symbols.urlModuleConfig),
        ),
    );
  }
}
