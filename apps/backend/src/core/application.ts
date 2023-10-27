import { Kafka } from 'kafkajs';
import mongoose from 'mongoose';

import { ConfigProvider } from './configProvider.js';
import { HttpServer } from './httpServer/httpServer.js';
import { coreSymbols, symbols } from './symbols.js';
import { type DependencyInjectionContainer } from '../libs/dependencyInjection/dependencyInjectionContainer.js';
import { DependencyInjectionContainerFactory } from '../libs/dependencyInjection/dependencyInjectionContainerFactory.js';
import { type DependencyInjectionModule } from '../libs/dependencyInjection/dependencyInjectionModule.js';
import { KafkaProducerServiceFactory } from '../libs/kafka/factories/kafkaProducerServiceFactory/kafkaProducerServiceFactory.js';
import { type KafkaProducerService } from '../libs/kafka/services/kafkaProducerService/kafkaProducerService.js';
import { LoggerServiceFactory } from '../libs/logger/factories/loggerServiceFactory/loggerServiceFactory.js';
import { type LoggerService } from '../libs/logger/services/loggerService/loggerService.js';
import { UrlModule } from '../modules/urlModule/urlModule.js';

export class Application {
  public static createContainer(): DependencyInjectionContainer {
    const domainUrl = ConfigProvider.getDomainUrl();

    const loggerLevel = ConfigProvider.getLoggerLevel();

    const kafkaBroker = ConfigProvider.getKafkaBroker();

    const kafkaClientId = ConfigProvider.getKafkaClientId();

    const modules: DependencyInjectionModule[] = [
      new UrlModule({
        domainUrl,
      }),
    ];

    const container = DependencyInjectionContainerFactory.create({ modules });

    container.bind<LoggerService>(symbols.loggerService, () => LoggerServiceFactory.create({ loggerLevel }));

    container.bind<KafkaProducerService>(symbols.kafkaProducerService, () =>
      KafkaProducerServiceFactory.create({
        broker: kafkaBroker,
        clientId: kafkaClientId,
      }),
    );

    return container;
  }

  public static async start(): Promise<void> {
    const container = Application.createContainer();

    const databaseUri = ConfigProvider.getMongoDatabaseUri();

    await mongoose.connect(databaseUri);

    const kafka = new Kafka({
      clientId: 'url-shortener-api',
      brokers: ['localhost:9093'],
    });

    const producer = kafka.producer({
      allowAutoTopicCreation: true,
    });

    await producer.connect();

    await producer.send({
      topic: 'url-clicks',
      messages: [
        {
          value: JSON.stringify({
            id: '1',
            data: {
              shortUrl: 'url',
              longUrl: 'url',
              createdAt: new Date().toISOString(),
            },
          }),
        },
      ],
    });

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
