// istanbul ignore file

import { env } from '@config/env';
import { TransformApiGatewayRequest } from '@core/application_business_rules/use_cases/transformApiGatewayRequest';
import { IRequest } from '@core/enterprise_business_rules/api_contract';
import { CoreErrorCodes } from '@core/enterprise_business_rules/constants';
import { NotFoundError, ServerError } from '@core/enterprise_business_rules/entities/errors';
import {
  CoreDbRepositoryInMysql,
  EmailRepositoryMandrill,
  IDbRepository,
  IEmailRepository,
  IInvokeRepository,
  ILogRepository,
  InvokeRepository,
  IRequestErrorHandler,
  IRequestRepository,
  ISecretsRepository,
  ISqsRepository,
  IUserIdentityRepository,
  LogRepositoryConsole,
  RequestErrorHandler,
  RequestRepository,
  SecretsManagerRepository,
  SqsRepository,
  UserIdentityRepository,
} from '@core/interface_adapters/adapters';
import { IRequestValidator } from '@core/interface_adapters/adapters/request_validator/iRequestValidator';
import { RequestValidator } from '@core/interface_adapters/adapters/request_validator/requestValidator';
import {
  IMerchantsRepository,
  IPokemonsRepository,
  ISuperappRepository,
  IUsersRepository,
  MerchantsRepository,
  SuperappRepository,
  UsersRepository,
} from '@lib/interface_adapters/storage';
import { PokemonsRepository } from '@lib/interface_adapters/storage/pokemons_repository/pokemonsRepository';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

export interface IServices {
  // Core services
  logRepository: ILogRepository;
  secretsRepository: ISecretsRepository;
  requestErrorHandler?: IRequestErrorHandler;
  requestValidator?: IRequestValidator;
  emailRepository?: IEmailRepository;
  dbBackofficeRepository: IDbRepository;
  requestRepository: IRequestRepository;
  invokeRepository: IInvokeRepository;
  // App Services
  merchantRepository: IMerchantsRepository;
  usersRepository: IUsersRepository;
  userIdentityRepository: IUserIdentityRepository;
  superappRepository: ISuperappRepository;
  sqsRepository: ISqsRepository;
  pokemonsRepository: IPokemonsRepository;
}

export class App {
  private readonly _services: IServices;
  private readonly _request?: IRequest;
  private _routes: any;

  constructor(event?: APIGatewayProxyEvent, lambdaContext?: Context) {
    this._request = new TransformApiGatewayRequest(event, lambdaContext).getRequest();
    const requestRepository = new RequestRepository(this.request, this.logRepository);
    const userIdentityRepository = new UserIdentityRepository(this.logRepository);
    const dbBackofficeRepository = CoreDbRepositoryInMysql.fromConnectionOptions({
      host: env.DB_HOST,
      port: +env.DB_PORT,
      database: env.DB_SCHEMA,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
    });

    this._services = {
      logRepository: this.logRepository,
      dbBackofficeRepository,
      requestRepository,
      userIdentityRepository,
      requestValidator: new RequestValidator(),
      invokeRepository: new InvokeRepository(this.logRepository),
      secretsRepository: new SecretsManagerRepository(this.logRepository),
      requestErrorHandler: new RequestErrorHandler(this.logRepository),
      emailRepository: new EmailRepositoryMandrill(this.logRepository),
      superappRepository: new SuperappRepository(requestRepository, this.logRepository),
      usersRepository: new UsersRepository(dbBackofficeRepository, this.logRepository),
      merchantRepository: new MerchantsRepository(requestRepository, this.logRepository),
      sqsRepository: new SqsRepository(this.logRepository),
      pokemonsRepository: new PokemonsRepository(requestRepository, this.logRepository),
    };
  }

  get request(): IRequest {
    return this._request;
  }

  get logRepository(): ILogRepository {
    return LogRepositoryConsole.getInstance(this._request.traceId);
  }

  get services(): IServices {
    return this._services;
  }

  set routes(routes: any) {
    this._routes = {
      ...routes,
    };
  }

  async handle(path: string, httpMethod: string): Promise<any> {
    this.services.logRepository.info({ method: 'App.handle', data: `Handling method: ${httpMethod} ${path}` });

    if (!this._routes) {
      throw new ServerError('No routes have been set in the app', CoreErrorCodes.ROUTES_NOT_SET);
    }

    const routeHandler = this._routes[path] && this._routes[path][httpMethod];
    if (!routeHandler) {
      throw new NotFoundError(
        'The endpoint was set in API Gateway but not in the main handler',
        CoreErrorCodes.ENDPOINT_NOT_FOUND,
      );
    }

    try {
      const response = await routeHandler(this.request, this.services);

      // Await the response (not returning the promise) to allow catching any error
      return response;
    } catch (err) {
      throw this.services.requestErrorHandler.handleError(err, this.request);
    }
  }

  async dispose(): Promise<void> {
    await this.services.dbBackofficeRepository.close();
  }
}
