export interface SendMessagePayload {
  readonly topic: string;
  readonly message: string;
}

export interface KafkaProducerService {
  sendMessage(payload: SendMessagePayload): Promise<void>;
}
