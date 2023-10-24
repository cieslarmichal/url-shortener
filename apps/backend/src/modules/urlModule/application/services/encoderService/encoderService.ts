export interface EncoderService {
  encodeBase62(data: number): Promise<string>;
}
