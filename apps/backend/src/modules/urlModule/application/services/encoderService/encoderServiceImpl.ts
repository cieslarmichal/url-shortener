import { type EncoderService } from './encoderService.js';

export class EncoderServiceImpl implements EncoderService {
  private readonly characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  public encodeBase62(decimalInput: bigint): string {
    let encoded = '';

    while (decimalInput > 0) {
      const remainder = Number(decimalInput % 62n);

      decimalInput /= 62n;

      encoded = this.characters[remainder] + encoded;
    }

    return encoded;
  }
}
