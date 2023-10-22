import { type Static, Type } from '@sinclair/typebox';

import { urlRecordSchema } from './urlRecordSchema.js';

export const createUrlRecordBodySchema = Type.Object({
  longUrl: Type.String(),
});

export type CreateUrlRecordBody = Static<typeof createUrlRecordBodySchema>;

export const createUrlRecordResponseCreatedBodySchema = Type.Object({
  urlRecord: urlRecordSchema,
});

export type CreateUrlRecordResponseCreatedBody = Static<typeof createUrlRecordResponseCreatedBodySchema>;
