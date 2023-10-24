import mongoose from 'mongoose';

import { ConfigProvider } from './configProvider.js';
import { HttpServer } from './httpServer/httpServer.js';
import { coreSymbols, symbols } from './symbols.js';
import { type DependencyInjectionContainer } from '../libs/dependencyInjection/dependencyInjectionContainer.js';
import { DependencyInjectionContainerFactory } from '../libs/dependencyInjection/dependencyInjectionContainerFactory.js';
import { type DependencyInjectionModule } from '../libs/dependencyInjection/dependencyInjectionModule.js';
import { LoggerServiceFactory } from '../libs/logger/factories/loggerServiceFactory/loggerServiceFactory.js';
import { type LoggerService } from '../libs/logger/services/loggerService/loggerService.js';
import { type UuidService } from '../libs/uuid/services/uuidService/uuidService.js';
import { UuidServiceImpl } from '../libs/uuid/services/uuidService/uuidServiceImpl.js';
import { UrlModule } from '../modules/urlModule/urlModule.js';

export class Application {
  public static createContainer(): DependencyInjectionContainer {
    const hashSecret = ConfigProvider.getHashSecret();

    const domainUrl = ConfigProvider.getDomainUrl();

    const loggerLevel = ConfigProvider.getLoggerLevel();

    const modules: DependencyInjectionModule[] = [
      new UrlModule({
        hashSecret,
        domainUrl,
      }),
    ];

    const container = DependencyInjectionContainerFactory.create({ modules });

    container.bind<LoggerService>(symbols.loggerService, () => LoggerServiceFactory.create({ loggerLevel }));

    container.bind<UuidService>(symbols.uuidService, () => new UuidServiceImpl());

    return container;
  }

  public static async start(): Promise<void> {
    const container = Application.createContainer();

    const databaseHost = ConfigProvider.getMongoDatabaseHost();

    const databasePort = ConfigProvider.getMongoDatabasePort();

    const databaseName = ConfigProvider.getMongoDatabaseName();

    const databaseUser = ConfigProvider.getMongoDatabaseUser();

    const databasePassword = ConfigProvider.getMongoDatabasePassword();

    await mongoose.connect(
      `mongodb://${databaseUser}:${databasePassword}@${databaseHost}:${databasePort}/${databaseName}`,
    );

    const serverHost = ConfigProvider.getServerHost();

    const serverPort = ConfigProvider.getServerPort();

    const server = new HttpServer(container);

    await server.start({
      host: serverHost,
      port: serverPort,
    });

    const loggerService = container.get<LoggerService>(coreSymbols.loggerService);

    loggerService.log({
      message: `Application started.`,
      context: {
        source: Application.name,
      },
    });
  }
}
