export interface UrlRecordDraft {
  readonly id: string;
  readonly createdAt: Date;
  readonly shortUrl: string;
  readonly longUrl: string;
}

export class UrlRecord {
  private readonly id: string;
  private readonly createdAt: Date;
  private readonly shortUrl: string;
  private readonly longUrl: string;

  public constructor(draft: UrlRecordDraft) {
    const { id, createdAt, shortUrl, longUrl } = draft;

    this.id = id;

    this.createdAt = createdAt;

    this.shortUrl = shortUrl;

    this.longUrl = longUrl;
  }

  public getId(): string {
    return this.id;
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getShortUrl(): string {
    return this.shortUrl;
  }

  public getLongUrl(): string {
    return this.longUrl;
  }
}
