import { type Producer } from 'kafkajs';

import { type KafkaProducerService, type SendMessagePayload } from './kafkaProducerService.js';
import { type KafkaClient } from '../../clients/kafkaClient/kafkaClient.js';

export class KafkaProducerServiceImpl implements KafkaProducerService {
  private readonly producer: Producer;
  private connected: boolean;

  public constructor(kafkaClient: KafkaClient) {
    this.producer = kafkaClient.producer({
      allowAutoTopicCreation: true,
    });

    this.connected = false;
  }

  public async sendMessage(payload: SendMessagePayload): Promise<void> {
    const { topic, message } = payload;

    await this.ensureConnection();

    await this.producer.send({
      topic,
      messages: [message],
    });
  }

  private async ensureConnection(): Promise<void> {
    if (!this.connected) {
      await this.producer.connect();

      this.connected = true;
    }
  }
}
