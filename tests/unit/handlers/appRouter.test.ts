import { CoreErrorCodes } from '@core/enterprise_business_rules/constants';
import { NotFoundError } from '@core/enterprise_business_rules/entities/errors';
import { appRouter } from '@handlers/index';
import { callbackStub } from '@tests/stubs/coreStubs';
import { apiGatewayRequestStub, lambdaContextStub } from '@tests/stubs/requestStubs';

const handleMock = jest.fn();
const disposeMock = jest.fn();
jest.mock('@lib/framework_drivers/routes/apiRoutes', () => ({
  ApiRoutes: { setupRoutes: () => Promise.resolve() },
}));

jest.mock('@lib/framework_drivers/config/app', () => ({
  App: jest.fn(() => ({
    handle: handleMock,
    dispose: disposeMock,
  })),
}));

describe('App handler test', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Should return warm up', async () => {
    const event = { source: 'serverless-plugin-warmup' };

    const result = await appRouter(event, lambdaContextStub, callbackStub);
    expect(result.statusCode).toEqual(500);
    expect(result.body).toEqual('Lambda is warm!');
  });

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
  };

  describe('the request is processed successfully', () => {
    it('should return a valid API Gateway response when the app process the request successfully', async () => {
      const appResponse = {
        fakeResponse: true,
      };
      handleMock.mockImplementation(() => appResponse);
      const response = await appRouter(apiGatewayRequestStub, lambdaContextStub, callbackStub);

      const expectedResponse = {
        result: appResponse,
      };

      expect(JSON.parse(response.body)).toMatchObject(expectedResponse);
    });

    it('should return a valid API Gateway response with an array when the controller returns an array', async () => {
      const appResponse = {
        fakeResponse: true,
      };
      handleMock.mockImplementation(() => [appResponse]);
      const response = await appRouter(apiGatewayRequestStub, lambdaContextStub, callbackStub);

      const expectedResponse = {
        result: [appResponse],
      };

      expect(JSON.parse(response.body)).toMatchObject(expectedResponse);
    });

    it('should return a valid API Gateway response with an entity serialized when the entity includes it', async () => {
      class FakeResponse {
        serialize(): any {
          return {
            fakeResponse: true,
          };
        }
      }

      handleMock.mockImplementation(() => new FakeResponse());
      const response = await appRouter(apiGatewayRequestStub, lambdaContextStub, callbackStub);

      const expectedResponse = {
        result: new FakeResponse().serialize(),
      };

      expect(JSON.parse(response.body)).toMatchObject(expectedResponse);
    });

    it('should return HTTP Status 200 when the app process the request successfully', async () => {
      const response = await appRouter(apiGatewayRequestStub, lambdaContextStub, callbackStub);

      expect(response.statusCode).toEqual(200);
    });

    it('should return CORS headers when the app process the request successfully', async () => {
      const response = await appRouter(apiGatewayRequestStub, lambdaContextStub, callbackStub);

      expect(response.headers).toMatchObject(corsHeaders);
    });

    it('should dispose resources when the app finishes successfully to process the request', async () => {
      await appRouter(apiGatewayRequestStub, lambdaContextStub, callbackStub);

      expect(disposeMock).toHaveBeenCalledTimes(1);
    });
  });

  describe('the request throws an error', () => {
    beforeEach(() => {
      handleMock.mockImplementation(() => {
        throw new Error('fake error');
      });
    });

    it('should return a valid error API Gateway response when the app throws a custom error', async () => {
      handleMock.mockImplementation(() => {
        throw new NotFoundError('fake error', CoreErrorCodes.UNKNOWN);
      });
      const response = await appRouter(apiGatewayRequestStub, lambdaContextStub, callbackStub);

      const expectedErrorResponse = {
        error: {
          name: 'NotFoundError',
          message: 'fake error',
          detail: 'fake error',
          code: CoreErrorCodes.UNKNOWN,
          type: 'NotFound',
          httpStatus: 404,
        },
      };

      expect(JSON.parse(response.body)).toMatchObject(expectedErrorResponse);
    });

    it('should return a valid error API Gateway response when the app throws a generic error', async () => {
      handleMock.mockImplementation(() => {
        throw new Error('fake generic error');
      });
      const response = await appRouter(apiGatewayRequestStub, lambdaContextStub, callbackStub);

      const expectedErrorResponse = {
        error: {
          message: 'fake generic error',
        },
      };

      expect(JSON.parse(response.body)).toMatchObject(expectedErrorResponse);
    });

    it('should return a 500 Server Error HTTP Status when the app throws a generic error', async () => {
      const response = await appRouter(apiGatewayRequestStub, lambdaContextStub, callbackStub);

      expect(response.statusCode).toEqual(500);
    });

    it('should return the custom error HTTP Status when the app throws a custom error', async () => {
      handleMock.mockImplementation(() => {
        throw new NotFoundError('fake not found error', undefined);
      });
      const response = await appRouter(apiGatewayRequestStub, lambdaContextStub, callbackStub);

      expect(response.statusCode).toEqual(404);
    });

    it('should return CORS headers when the app throws an error', async () => {
      const response = await appRouter(apiGatewayRequestStub, lambdaContextStub, callbackStub);

      expect(response.headers).toMatchObject(corsHeaders);
    });

    it('should dispose resources when the app throws an error', async () => {
      await appRouter(apiGatewayRequestStub, lambdaContextStub, callbackStub);

      expect(disposeMock).toHaveBeenCalledTimes(1);
    });
  });
});
