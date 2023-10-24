import {
  createUrlRecordBodySchema,
  createUrlRecordResponseCreatedBodySchema,
  type CreateUrlRecordBody,
  type CreateUrlRecordResponseCreatedBody,
} from './schemas/createUrlRecordSchema.js';
import {
  findLongUrlPathParametersSchema,
  findLongUrlResponseMovedTemporarilyHeadersSchema,
  type FindLongUrlPathParameters,
  type FindLongUrlResponseMovedTemporarilyHeaders,
} from './schemas/findLongUrlSchema.js';
import { type UrlRecordDto } from './schemas/urlRecordDto.js';
import { ResourceNotFoundError } from '../../../../../common/errors/common/resourceNotFoundError.js';
import { type HttpController } from '../../../../../common/types/http/httpController.js';
import { HttpMethodName } from '../../../../../common/types/http/httpMethodName.js';
import { type HttpRequest } from '../../../../../common/types/http/httpRequest.js';
import {
  type HttpCreatedResponse,
  type HttpOkResponse,
  type HttpNotFoundResponse,
} from '../../../../../common/types/http/httpResponse.js';
import { HttpRoute } from '../../../../../common/types/http/httpRoute.js';
import { HttpStatusCode } from '../../../../../common/types/http/httpStatusCode.js';
import { responseErrorBodySchema, type ResponseErrorBody } from '../../../../../common/types/http/responseErrorBody.js';
import { type CreateUrlRecordCommandHandler } from '../../../application/commandHandlers/createUrlRecordCommandHandler/createUrlRecordCommandHandler.js';
import { type FindLongUrlQueryHandler } from '../../../application/queryHandlers/findLongUrlQueryHandler/findLongUrlQueryHandler.js';
import { type UrlRecord } from '../../../domain/entities/urlRecord/urlRecord.js';
import { type UrlModuleConfig } from '../../../urlModuleConfig.js';

export class UrlHttpController implements HttpController {
  public readonly basePath = '';

  public constructor(
    private readonly createUrlRecordCommandHandler: CreateUrlRecordCommandHandler,
    private readonly findLongUrlQueryHandler: FindLongUrlQueryHandler,
    private readonly config: UrlModuleConfig,
  ) {}

  public getHttpRoutes(): HttpRoute[] {
    return [
      new HttpRoute({
        path: '/urls',
        method: HttpMethodName.post,
        handler: this.createUrlRecord.bind(this),
        schema: {
          request: {
            body: createUrlRecordBodySchema,
          },
          response: {
            [HttpStatusCode.created]: {
              schema: createUrlRecordResponseCreatedBodySchema,
              description: 'UrlRecord created.',
            },
            [HttpStatusCode.unprocessableEntity]: {
              schema: responseErrorBodySchema,
              description: 'Error exception.',
            },
          },
        },
        tags: ['UrlRecord'],
        description: 'Create UrlRecord.',
      }),
      new HttpRoute({
        method: HttpMethodName.get,
        path: ':urlPathParam',
        handler: this.findUrlRecord.bind(this),
        schema: {
          request: {
            pathParams: findLongUrlPathParametersSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              schema: findLongUrlResponseMovedTemporarilyHeadersSchema,
              description: 'Long url found.',
            },
            [HttpStatusCode.notFound]: {
              schema: responseErrorBodySchema,
              description: 'Error exception.',
            },
          },
        },
        tags: ['UrlRecord'],
        description: 'Find long url by short url.',
      }),
    ];
  }

  private async createUrlRecord(
    request: HttpRequest<CreateUrlRecordBody>,
  ): Promise<HttpCreatedResponse<CreateUrlRecordResponseCreatedBody>> {
    const { longUrl } = request.body;

    const { urlRecord } = await this.createUrlRecordCommandHandler.execute({
      longUrl,
    });

    return {
      statusCode: HttpStatusCode.created,
      body: { urlRecord: this.mapUrlRecordToDto(urlRecord) },
    };
  }

  private async findUrlRecord(
    request: HttpRequest<undefined, undefined, FindLongUrlPathParameters>,
  ): Promise<HttpOkResponse<FindLongUrlResponseMovedTemporarilyHeaders> | HttpNotFoundResponse<ResponseErrorBody>> {
    const { shortUrlPathParam } = request.pathParams;

    const { domainUrl } = this.config;

    const shortUrl = `${domainUrl}/${shortUrlPathParam}`;

    try {
      const { longUrl } = await this.findLongUrlQueryHandler.execute({ shortUrl });

      return {
        statusCode: HttpStatusCode.ok,
        body: { longUrl },
      };
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return {
          statusCode: HttpStatusCode.notFound,
          body: { error },
        };
      }

      throw error;
    }
  }

  private mapUrlRecordToDto(urlRecord: UrlRecord): UrlRecordDto {
    return {
      id: urlRecord.getId(),
      createdAt: urlRecord.getCreatedAt().toISOString(),
      longUrl: urlRecord.getLongUrl(),
      shortUrl: urlRecord.getShortUrl(),
    };
  }
}
