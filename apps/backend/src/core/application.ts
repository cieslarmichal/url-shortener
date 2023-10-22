import { ConfigProvider } from './configProvider.js';
import { type PostgresDatabaseClient } from './database/postgresDatabaseClient/postgresDatabaseClient.js';
import { PostgresDatabaseClientFactory } from './database/postgresDatabaseClient/postgresDatabaseClientFactory.js';
import { HttpServer } from './httpServer/httpServer.js';
import { coreSymbols, symbols } from './symbols.js';
import { type DependencyInjectionContainer } from '../libs/dependencyInjection/dependencyInjectionContainer.js';
import { DependencyInjectionContainerFactory } from '../libs/dependencyInjection/dependencyInjectionContainerFactory.js';
import { type DependencyInjectionModule } from '../libs/dependencyInjection/dependencyInjectionModule.js';
import { LoggerServiceFactory } from '../libs/logger/factories/loggerServiceFactory/loggerServiceFactory.js';
import { type LoggerService } from '../libs/logger/services/loggerService/loggerService.js';
import { AuthModule } from '../modules/authModule/authModule.js';
import { UserModule } from '../modules/userModule/userModule.js';

export class Application {
  public static createContainer(): DependencyInjectionContainer {
    const databaseHost = ConfigProvider.getPostgresDatabaseHost();

    const databaseName = ConfigProvider.getPostgresDatabaseName();

    const databaseUser = ConfigProvider.getPostgresDatabaseUser();

    const databasePassword = ConfigProvider.getPostgresDatabasePassword();

    const hashSaltRounds = ConfigProvider.getHashSaltRounds();

    const loggerLevel = ConfigProvider.getLoggerLevel();

    const modules: DependencyInjectionModule[] = [
      new UserModule({
        hashSaltRounds,
      }),
    ];

    const container = DependencyInjectionContainerFactory.create({ modules });

    container.bind<LoggerService>(symbols.loggerService, () => LoggerServiceFactory.create({ loggerLevel }));

    container.bind<PostgresDatabaseClient>(symbols.postgresDatabaseClient, () =>
      PostgresDatabaseClientFactory.create({
        databaseHost,
        databaseName,
        databaseUser,
        databasePassword,
      }),
    );

    return container;
  }

  public static async start(): Promise<void> {
    const container = Application.createContainer();

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
