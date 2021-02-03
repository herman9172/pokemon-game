import { IResponse } from '@core/enterprise_business_rules/api_contract';
import { HttpStatusCode } from '@core/enterprise_business_rules/constants/httpCodes';
import { BaseError } from '@core/enterprise_business_rules/entities/errors/baseError';
import { App } from '@lib/framework_drivers/config/app';
import { ApiRoutes } from '@lib/framework_drivers/routes/apiRoutes';
import { APIGatewayProxyEvent, Context, Handler } from 'aws-lambda';

const router: Handler = async (event: APIGatewayProxyEvent | any, context: Context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  if (event.source === 'serverless-plugin-warmup') {
    return {
      statusCode: 500,
      body: 'Lambda is warm!',
    };
  }

  const app = new App(event);
  app.routes = ApiRoutes.setupRoutes();

  let response: IResponse;
  try {
    const { resource, httpMethod } = event;
    const result = await app.handle(resource, httpMethod);
    response = apiResponse(result);
  } catch (err) {
    response = errorResponse(err);
  } finally {
    await app.dispose();
  }

  return response;
};

const errorResponse = (error: any): IResponse => {
  const errorWithoutStack = { ...BaseError.serialize(error), stack: undefined };

  return {
    statusCode: error.httpStatus || HttpStatusCode.INTERNAL_SERVER_ERROR,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      error: errorWithoutStack,
    }),
  };
};

const apiResponse = (result: any): IResponse => {
  const serializeResult = (r) => (r && typeof r.serialize === 'function' ? r.serialize() : r);
  const serializedResult = result && (Array.isArray(result) ? result.map(serializeResult) : serializeResult(result));

  return {
    statusCode: HttpStatusCode.OK,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({
      result: serializedResult,
    }),
  };
};

export { router };
