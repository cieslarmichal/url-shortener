import base62 from 'base62';

import { type EncoderService } from './encoderService.js';

export class EncoderServiceImpl implements EncoderService {
  public async encodeBase62(data: number): Promise<string> {
    return base62.encode(data);
  }
}
