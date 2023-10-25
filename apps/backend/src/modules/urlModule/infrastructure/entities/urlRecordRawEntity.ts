/* eslint-disable @typescript-eslint/naming-convention */

import { getModelForClass, prop } from '@typegoose/typegoose';

export class UrlRecordRawEntity {
  @prop()
  public createdAt!: Date;

  @prop()
  public shortUrl!: string;

  @prop()
  public longUrl!: string;
}

export const urlRecordRawEntityModel = getModelForClass(UrlRecordRawEntity);
