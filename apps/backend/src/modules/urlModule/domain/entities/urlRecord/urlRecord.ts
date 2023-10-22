export interface UrlRecordDraft {
  readonly id: string;
  readonly createdAt: Date;
  readonly shortUrl: string;
  readonly longUrl: string;
}

export class UrlRecord {
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly shortUrl: string;
  public readonly longUrl: string;

  public constructor(draft: UrlRecordDraft) {
    const { id, createdAt, shortUrl, longUrl } = draft;

    this.id = id;

    this.createdAt = createdAt;

    this.shortUrl = shortUrl;

    this.longUrl = longUrl;
  }
}
