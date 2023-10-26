import { Assert } from '../common/validation/assert.js';
import { Validator } from '../common/validation/validator.js';
import { EnvParser } from '../libs/envParser/envParser.js';
import { LoggerLevel } from '../libs/logger/types/loggerLevel.js';

export class ConfigProvider {
  private static getStringEnvVariable(envVariableName: string): string {
    const value = EnvParser.parseString({ name: envVariableName });

    Assert.isNotEmptyString(value);

    return value;
  }

  private static getEnumEnvVariable<T extends Record<string, string>>(
    enumType: T,
    envVariableName: string,
  ): T[keyof T] {
    const value = EnvParser.parseString({ name: envVariableName });

    Assert.isEnum(enumType, value);

    return value as T[keyof T];
  }

  public static getLoggerLevel(): LoggerLevel {
    return this.getEnumEnvVariable(LoggerLevel, 'LOGGER_LEVEL');
  }

  public static getServerHost(): string {
    return EnvParser.parseString({ name: 'SERVER_HOST' }) || '0.0.0.0';
  }

  public static getServerPort(): number {
    const envVariable = 'SERVER_PORT';

    const serverPort = EnvParser.parseNumber({ name: envVariable });

    if (!Validator.isNumber(serverPort)) {
      return 8080;
    }

    return serverPort;
  }

  public static getMongoDatabaseUser(): string {
    return this.getStringEnvVariable('MONGO_DATABASE_USER');
  }

  public static getMongoDatabasePassword(): string {
    return this.getStringEnvVariable('MONGO_DATABASE_PASSWORD');
  }

  public static getMongoDatabaseUri(): string {
    return this.getStringEnvVariable('MONGO_DATABASE_URI');
  }

  public static getDomainUrl(): string {
    return this.getStringEnvVariable('DOMAIN_URL');
  }
}
