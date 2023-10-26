import { type EncoderService } from './encoderService.js';

export class EncoderServiceImpl implements EncoderService {
  private readonly characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  public encodeBase62(decimalInput: bigint): string {
    const base62 = 62n;

    let encoded = '';

    while (decimalInput > 0) {
      const remainder = Number(decimalInput % base62);

      decimalInput /= base62;

      encoded = this.characters[remainder] + encoded;
    }

    return encoded;
  }
}
