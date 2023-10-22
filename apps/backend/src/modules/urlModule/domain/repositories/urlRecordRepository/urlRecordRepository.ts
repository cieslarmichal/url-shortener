import { type UrlRecord } from '../../../domain/entities/urlRecord/urlRecord.js';

export interface CreateUrlRecordPayload {
  readonly shortUrl: string;
  readonly longUrl: string;
}

export interface FindUrlRecordPayload {
  readonly shortUrl?: string;
  readonly longUrl?: string;
}

export interface UrlRecordRepository {
  createUrlRecord(input: CreateUrlRecordPayload): Promise<UrlRecord>;
  findUrlRecord(input: FindUrlRecordPayload): Promise<UrlRecord | null>;
}
