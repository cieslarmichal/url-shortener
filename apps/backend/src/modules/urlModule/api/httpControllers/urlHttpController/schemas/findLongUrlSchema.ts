import { type Static, Type } from '@sinclair/typebox';

export const findLongUrlPathParametersSchema = Type.Object({
  shortUrlPathParam: Type.String(),
});

export type FindLongUrlPathParameters = Static<typeof findLongUrlPathParametersSchema>;

export const findLongUrlResponseMovedTemporarilyHeadersSchema = Type.Object({
  longUrl: Type.String(),
});

export type FindLongUrlResponseMovedTemporarilyHeaders = Static<
  typeof findLongUrlResponseMovedTemporarilyHeadersSchema
>;
