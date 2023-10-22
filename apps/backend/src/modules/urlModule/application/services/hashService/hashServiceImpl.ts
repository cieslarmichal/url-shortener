import { compare, genSalt, hash } from 'bcrypt';

import { type HashService } from './hashService.js';
import { type UrlModuleConfig } from '../../../urlModuleConfig.js';

export class HashServiceImpl implements HashService {
  public constructor(private readonly urlRecordModuleConfig: UrlModuleConfig) {}

  public async hash(plainData: string): Promise<string> {
    const salt = await this.generateSalt();

    return hash(plainData, salt);
  }

  public async compare(plainData: string, hashedData: string): Promise<boolean> {
    return compare(plainData, hashedData);
  }

  private async generateSalt(): Promise<string> {
    const { hashSaltRounds } = this.urlRecordModuleConfig;

    return genSalt(hashSaltRounds);
  }
}
