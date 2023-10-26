import { Kafka } from 'kafkajs';

import { type KafkaClient } from '../../clients/kafkaClient/kafkaClient.js';
import { type KafkaConfig } from '../../types/kafkaConfig.js';

export class KafkaClientFactory {
  public static create(config: KafkaConfig): KafkaClient {
    const kafkaClient = new Kafka({
      clientId: config.clientId,
      brokers: [config.broker],
    });

    return kafkaClient;
  }
}
