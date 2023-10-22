import {
  createUrlRecordBodySchema,
  createUrlRecordResponseCreatedBodySchema,
  type CreateUrlRecordBody,
  type CreateUrlRecordResponseCreatedBody,
} from './schemas/createUrlRecordSchema.js';
import {
  deleteUrlRecordPathParametersSchema,
  deleteUrlRecordResponseNoContentBodySchema,
  type DeleteUrlRecordPathParameters,
  type DeleteUrlRecordResponseNoContentBody,
} from './schemas/deleteUrlRecordSchema.js';
import {
  findLongUrlPathParametersSchema,
  findLongUrlResponseMovedTemporarilyHeadersSchema,
  type FindLongUrlPathParameters,
  type FindLongUrlResponseMovedTemporarilyHeaders,
} from './schemas/findLongUrlSchema.js';
import {
  loginUrlRecordBodySchema,
  loginUrlRecordResponseOkBodySchema,
  type LoginUrlRecordBody,
  type LoginUrlRecordResponseOkBody,
} from './schemas/loginUrlRecordSchema.js';
import { ResourceAlreadyExistsError } from '../../../../../common/errors/common/resourceAlreadyExistsError.js';
import { ResourceNotFoundError } from '../../../../../common/errors/common/resourceNotFoundError.js';
import { type HttpController } from '../../../../../common/types/http/httpController.js';
import { HttpMethodName } from '../../../../../common/types/http/httpMethodName.js';
import { type HttpRequest } from '../../../../../common/types/http/httpRequest.js';
import {
  type HttpCreatedResponse,
  type HttpUnprocessableEntityResponse,
  type HttpOkResponse,
  type HttpNotFoundResponse,
  type HttpForbiddenResponse,
  type HttpNoContentResponse,
} from '../../../../../common/types/http/httpResponse.js';
import { HttpRoute } from '../../../../../common/types/http/httpRoute.js';
import { HttpStatusCode } from '../../../../../common/types/http/httpStatusCode.js';
import { responseErrorBodySchema, type ResponseErrorBody } from '../../../../../common/types/http/responseErrorBody.js';
import { type DeleteUrlRecordCommandHandler } from '../../../application/commandHandlers/deleteUrlRecordCommandHandler/deleteUrlRecordCommandHandler.js';
import { type LoginUrlRecordCommandHandler } from '../../../application/commandHandlers/loginUrlRecordCommandHandler/loginUrlRecordCommandHandler.js';
import { type RegisterUrlRecordCommandHandler } from '../../../application/commandHandlers/registerUrlRecordCommandHandler/registerUrlRecordCommandHandler.js';
import { type FindUrlRecordQueryHandler } from '../../../application/queryHandlers/findUrlRecordQueryHandler/findUrlRecordQueryHandler.js';
import { type UrlRecord } from '../../../domain/entities/urlRecord/urlRecord.js';

export class UrlHttpController implements HttpController {
  public readonly basePath = '';

  public constructor(
    private readonly registerUrlRecordCommandHandler: RegisterUrlRecordCommandHandler,
    private readonly loginUrlRecordCommandHandler: LoginUrlRecordCommandHandler,
    private readonly deleteUrlRecordCommandHandler: DeleteUrlRecordCommandHandler,
    private readonly findUrlRecordQueryHandler: FindUrlRecordQueryHandler,
  ) {}

  public getHttpRoutes(): HttpRoute[] {
    return [
      new HttpRoute({
        method: HttpMethodName.post,
        path: 'register',
        handler: this.registerUrlRecord.bind(this),
        schema: {
          request: {
            body: createUrlRecordBodySchema,
          },
          response: {
            [HttpStatusCode.created]: {
              schema: createUrlRecordResponseCreatedBodySchema,
              description: 'UrlRecord registered.',
            },
            [HttpStatusCode.unprocessableEntity]: {
              schema: responseErrorBodySchema,
              description: 'Error exception.',
            },
          },
        },
        tags: ['UrlRecord'],
        description: 'Register urlRecord.',
      }),
      new HttpRoute({
        method: HttpMethodName.post,
        path: 'login',
        handler: this.loginUrlRecord.bind(this),
        schema: {
          request: {
            body: loginUrlRecordBodySchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              schema: loginUrlRecordResponseOkBodySchema,
              description: 'UrlRecord logged in.',
            },
            [HttpStatusCode.notFound]: {
              schema: responseErrorBodySchema,
              description: 'Error exception.',
            },
          },
        },
        tags: ['UrlRecord'],
        description: 'Login urlRecord.',
      }),
      new HttpRoute({
        method: HttpMethodName.get,
        path: ':id',
        handler: this.findUrlRecord.bind(this),
        schema: {
          request: {
            pathParams: findLongUrlPathParametersSchema,
          },
          response: {
            [HttpStatusCode.ok]: {
              schema: findLongUrlResponseMovedTemporarilyHeadersSchema,
              description: 'UrlRecord found.',
            },
            [HttpStatusCode.notFound]: {
              schema: responseErrorBodySchema,
              description: 'Error exception.',
            },
          },
        },
        securityMode: SecurityMode.bearer,
        tags: ['UrlRecord'],
        description: 'Find urlRecord by id.',
      }),
      new HttpRoute({
        method: HttpMethodName.delete,
        path: ':id',
        handler: this.deleteUrlRecord.bind(this),
        schema: {
          request: {
            pathParams: deleteUrlRecordPathParametersSchema,
          },
          response: {
            [HttpStatusCode.noContent]: {
              schema: deleteUrlRecordResponseNoContentBodySchema,
              description: 'UrlRecord deleted.',
            },
            [HttpStatusCode.notFound]: {
              schema: responseErrorBodySchema,
              description: 'Error exception.',
            },
          },
        },
        securityMode: SecurityMode.bearer,
        tags: ['UrlRecord'],
        description: 'Delete urlRecord.',
      }),
    ];
  }

  private async registerUrlRecord(
    request: HttpRequest<CreateUrlRecordBody>,
  ): Promise<
    HttpCreatedResponse<CreateUrlRecordResponseCreatedBody> | HttpUnprocessableEntityResponse<ResponseErrorBody>
  > {
    try {
      const { email, password } = request.body;

      const { urlRecord } = await this.registerUrlRecordCommandHandler.execute({
        email,
        password,
      });

      return {
        statusCode: HttpStatusCode.created,
        body: { urlRecord },
      };
    } catch (error) {
      if (error instanceof ResourceAlreadyExistsError) {
        return {
          statusCode: HttpStatusCode.unprocessableEntity,
          body: { error },
        };
      }

      throw error;
    }
  }

  private async loginUrlRecord(
    request: HttpRequest<LoginUrlRecordBody>,
  ): Promise<HttpOkResponse<LoginUrlRecordResponseOkBody> | HttpNotFoundResponse<ResponseErrorBody>> {
    try {
      const { email, password } = request.body;

      const { accessToken } = await this.loginUrlRecordCommandHandler.execute({
        email,
        password,
      });

      return {
        statusCode: HttpStatusCode.ok,
        body: { token: accessToken },
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

  private async findUrlRecord(
    request: HttpRequest<undefined, undefined, FindLongUrlPathParameters>,
  ): Promise<
    | HttpOkResponse<FindLongUrlResponseMovedTemporarilyHeaders>
    | HttpNotFoundResponse<ResponseErrorBody>
    | HttpForbiddenResponse<ResponseErrorBody>
  > {
    const { id } = request.pathParams;

    const { urlRecordId } = await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    if (urlRecordId !== id) {
      return {
        statusCode: HttpStatusCode.forbidden,
        body: {
          error: {
            name: '',
            message: '',
          },
        },
      };
    }

    try {
      const { urlRecord } = await this.findUrlRecordQueryHandler.execute({ urlRecordId: id });

      return {
        statusCode: HttpStatusCode.ok,
        body: { urlRecord: urlRecord as UrlRecord },
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

  private async deleteUrlRecord(
    request: HttpRequest<undefined, undefined, DeleteUrlRecordPathParameters>,
  ): Promise<
    | HttpNoContentResponse<DeleteUrlRecordResponseNoContentBody>
    | HttpNotFoundResponse<ResponseErrorBody>
    | HttpForbiddenResponse<ResponseErrorBody>
  > {
    const { id } = request.pathParams;

    const { urlRecordId } = await this.accessControlService.verifyBearerToken({
      authorizationHeader: request.headers['authorization'],
    });

    if (urlRecordId !== id) {
      return {
        statusCode: HttpStatusCode.forbidden,
        body: {
          error: {
            name: '',
            message: '',
          },
        },
      };
    }

    try {
      await this.deleteUrlRecordCommandHandler.execute({ urlRecordId: id });
    } catch (error) {
      if (error instanceof ResourceNotFoundError) {
        return {
          statusCode: HttpStatusCode.notFound,
          body: { error },
        };
      }

      throw error;
    }

    return {
      statusCode: HttpStatusCode.noContent,
      body: null,
    };
  }
}
