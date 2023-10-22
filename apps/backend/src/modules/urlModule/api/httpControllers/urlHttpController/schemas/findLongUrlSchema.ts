import { type Static, Type } from '@sinclair/typebox';

import { urlRecordSchema } from './urlRecordSchema.js';

export const findLongUrlPathParametersSchema = Type.Object({
  shortUrlPathParam: Type.String(),
});

export type FindLongUrlPathParameters = Static<typeof findLongUrlPathParametersSchema>;

export const findLongUrlResponseMovedTemporarilyHeadersSchema = Type.Object({
  urlRecord: urlRecordSchema,
});

export type FindLongUrlResponseMovedTemporarilyHeaders = Static<
  typeof findLongUrlResponseMovedTemporarilyHeadersSchema
>;
