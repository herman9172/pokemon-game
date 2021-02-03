import { NotFoundError, ServerError, ValidationError } from '@core/enterprise_business_rules/entities/errors';
import { App } from '@lib/framework_drivers/config/app';
import { apiGatewayRequestStub, lambdaContextStub } from '@tests/stubs/requestStubs';
import { dbRepositoryStub, requestErrorHandlerStub, servicesStub } from '@tests/stubs/servicesStubs';
// import {CacheRepositoryRedis, LogRepositoryConsole,} from '@core/interface_adapters/adapters';

// If a new dependency is added in App, it must be included in coreInterfacesMock
// otherwise, a {dependencyName]
//
// Mock constructors need named functions; disable linter rules
// tslint:disable: only-arrow-functions object-literal-shorthand typedef
jest.mock('@core/interface_adapters/adapters', () => ({
  CoreDbRepositoryInMysql: {
    fromSecretRepository: () => servicesStub.dbBackofficeRepository,
    fromConnectionOptions: () => servicesStub.dbBackofficeRepository,
  },
  LogRepositoryConsole: function() {
    return servicesStub.logRepository;
  },
  RequestErrorHandler: function() {
    return servicesStub.requestErrorHandler;
  },
  SecretsManagerRepository: function() {
    return servicesStub.secretsRepository;
  },
  RequestRepository: function() {
    return servicesStub.requestRepository;
  },
  SqsRepository: function() {
    return servicesStub.sqsRepository;
  },
  InvokeRepository: function() {
    return servicesStub.invokeRepository;
  },
  EmailRepositoryMandrill: function() {
    return servicesStub.emailRepository;
  },
  // CacheRepositoryRedis: function() {
  //   return servicesStub.cacheRepositoryRedis;
  // },

  AgentsRepository: function() {
    return servicesStub.agentsRepository;
  },

  UserIdentityRepository: function() {
    return servicesStub.userIdentityRepository;
  },
}));

const routeMock = jest.fn();

const routesStub = {
  '/existing/route': {
    GET: routeMock,
  },
};

describe('App', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('handle an endpoint route', () => {
    // it('getInstance should throw an error', () => {
    //   const logRepository = new LogRepositoryConsole('123');
    //   expect(() => CacheRepositoryRedis.getInstance(logRepository)).toThrow(new Error('Cannot read property \'getInstance\' of undefined'));
    // })

    it('should return the route result when the route path exists', async () => {
      const app = new App(apiGatewayRequestStub, lambdaContextStub);
      app.routes = routesStub;

      const fakeRouteResult = {
        fakeResult: true,
      };

      routeMock.mockImplementation(() => fakeRouteResult);
      const result = await app.handle('/existing/route', 'GET');

      expect(result).toMatchObject(fakeRouteResult);
    });

    it('should throw a server error when no routes are set', async () => {
      expect.assertions(1);

      const app = new App(apiGatewayRequestStub, lambdaContextStub);

      try {
        await app.handle('/existing/route', 'GET');
      } catch (err) {
        expect(err).toBeInstanceOf(ServerError);
      }
    });

    it('should throw a not found error when the route exist but not the verb', async () => {
      expect.assertions(1);

      const app = new App(apiGatewayRequestStub, lambdaContextStub);
      app.routes = routesStub;

      try {
        await app.handle('/existing/route', 'POST');
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundError);
      }
    });

    it('should throw a not found error when the route does not exist', async () => {
      expect.assertions(1);

      const app = new App(apiGatewayRequestStub, lambdaContextStub);
      app.routes = routesStub;

      try {
        await app.handle('/not/existing/route', 'GET');
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundError);
      }
    });

    it('should handle the error if any error is thrown', async () => {
      expect.assertions(1);

      routeMock.mockImplementation(() => {
        throw new ValidationError('any error', undefined);
      });

      const errorHandler = spyOn(requestErrorHandlerStub, 'handleError');

      const app = new App(apiGatewayRequestStub, lambdaContextStub);
      app.routes = routesStub;

      try {
        await app.handle('/existing/route', 'GET');
      } catch {
        expect(errorHandler).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('disposing resources', () => {
    it('should dispose the database repository', async () => {
      const closeDatabase = spyOn(dbRepositoryStub, 'close');
      const app = new App(apiGatewayRequestStub, lambdaContextStub);
      await app.dispose();

      expect(closeDatabase).toHaveBeenCalledTimes(1);
    });
  });
});
