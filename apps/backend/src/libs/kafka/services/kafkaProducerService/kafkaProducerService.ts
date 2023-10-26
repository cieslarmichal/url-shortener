export type Message = { value: string };

export interface SendMessagePayload {
  readonly topic: string;
  readonly message: Message;
}

export interface KafkaProducerService {
  sendMessage(payload: SendMessagePayload): Promise<void>;
}
