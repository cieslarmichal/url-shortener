import { type KafkaProducerService } from '../../services/kafkaProducerService/kafkaProducerService.js';
import { KafkaProducerServiceImpl } from '../../services/kafkaProducerService/kafkaProducerServiceImpl.js';
import { type KafkaConfig } from '../../types/kafkaConfig.js';
import { KafkaClientFactory } from '../kafkaClientFactory/kafkaClientFactory.js';

export class KafkaProducerServiceFactory {
  public static create(config: KafkaConfig): KafkaProducerService {
    const kafkaClient = KafkaClientFactory.create(config);

    return new KafkaProducerServiceImpl(kafkaClient);
  }
}
