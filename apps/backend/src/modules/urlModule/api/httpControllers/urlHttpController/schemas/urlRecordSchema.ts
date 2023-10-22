import { Type } from '@sinclair/typebox';

export const urlRecordSchema = Type.Object({
  id: Type.String(),
  createdAt: Type.String(),
  shortUrl: Type.String(),
  longUrl: Type.String(),
});
