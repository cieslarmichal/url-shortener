import { type EncoderService } from './encoderService.js';

export class EncoderServiceImpl implements EncoderService {
  public encodeBase62(hexString: string): string {
    return parseInt(hexString, 16).toString(62);
  }
}
