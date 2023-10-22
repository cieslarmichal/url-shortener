import { type Static, Type } from '@sinclair/typebox';

export const findShortUrlQueryParametersSchema = Type.Object({
  longUrl: Type.String(),
});

export type FindShortUrlQueryParameters = Static<typeof findShortUrlQueryParametersSchema>;

export const findShortUrlResponseOkBodySchema = Type.Object({
  shortUrl: Type.String(),
});

export type FindShortUrlResponseOkBody = Static<typeof findShortUrlResponseOkBodySchema>;
