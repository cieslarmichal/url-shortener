import { createHmac } from 'node:crypto';

import { type HashService } from './hashService.js';
import { type UrlModuleConfig } from '../../../urlModuleConfig.js';

export class HashServiceImpl implements HashService {
  public constructor(private readonly config: UrlModuleConfig) {}

  public async hash(data: string): Promise<string> {
    return createHmac('sha256', this.config.hashSecret).update(data).digest('hex');
  }
}
