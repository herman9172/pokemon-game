import { TransformApiGatewayRequest } from '@core/application_business_rules/use_cases/transformApiGatewayRequest';
import { headerLowercaseStub, headerStub } from '@tests/stubs/requestStubs';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('Transform ApiGatewayEvent', () => {
  it('should return access token', () => {
    const request: APIGatewayProxyEvent = {
      body: JSON.stringify({ data: '123' }),
      headers: headerStub,
    } as APIGatewayProxyEvent;

    const transform = new TransformApiGatewayRequest(request);
    const data = transform.getRequest();
    expect(data.cognitoAccessToken).toEqual(headerStub['Access-Token']);
  }); // end of return access token

  it('should return id token from auth header', () => {
    const request: APIGatewayProxyEvent = {
      body: JSON.stringify({ data: '123' }),
      headers: headerStub,
    } as APIGatewayProxyEvent;

    const transform = new TransformApiGatewayRequest(request);
    const data = transform.getRequest();
    expect(data.cognitoIdToken).toEqual(headerStub.Authorization.replace('Bearer ', ''));
  }); // end of return id token from auth header

  it('should return available params even when no headers are provided', () => {
    const request: APIGatewayProxyEvent = ({
      pathParameters: {
        pathParamName: '123',
      },
    } as unknown) as APIGatewayProxyEvent;

    const transform = new TransformApiGatewayRequest(request);
    const data = transform.getRequest();

    expect(data.params).toMatchObject({
      pathParamName: '123',
    });
  });

  it('should return a random trace ID when no api gateway event is provided', () => {
    const transform = new TransformApiGatewayRequest(undefined);
    const data = transform.getRequest();
    expect(data.traceId).toBeTruthy();
  });

  it('should return api gateway params when provided', () => {
    const request: APIGatewayProxyEvent = {
      body: JSON.stringify({ data: '123' }),
      headers: headerStub,
      requestContext: {
        stage: 'test-stage',
      },
      httpMethod: 'get',
      path: '/route',
    } as APIGatewayProxyEvent;

    const transform = new TransformApiGatewayRequest(request);
    const data = transform.getRequest();
    expect(data.stage).toEqual('test-stage');
    expect(data.path).toEqual('/route');
    expect(data.method).toEqual('GET');
  });

  it('should return source IP when available', () => {
    const request: APIGatewayProxyEvent = {
      body: JSON.stringify({ data: '123' }),
      headers: headerStub,
      requestContext: {
        identity: {
          sourceIp: '0.0.0.0',
        },
      },
    } as APIGatewayProxyEvent;

    const transform = new TransformApiGatewayRequest(request);
    const data = transform.getRequest();
    expect(data.sourceIp).toEqual('0.0.0.0');
  });

  it('should transform the request with device ID when the FCM token is not available', () => {
    const request: APIGatewayProxyEvent = ({
      body: JSON.stringify({ data: '123' }),
      headers: { ...headerStub, 'Fcm-Token': undefined },
    } as unknown) as APIGatewayProxyEvent;

    const transform = new TransformApiGatewayRequest(request);
    const data = transform.getRequest();
    expect(data.fcmToken).toEqual(headerStub['Device-Id']);
  });
});

describe('Transform ApiGatewayEvent with lowercase custom headers', () => {
  it('should return access token', () => {
    const request: APIGatewayProxyEvent = {
      body: JSON.stringify({ data: '123' }),
      headers: headerLowercaseStub,
    } as APIGatewayProxyEvent;

    const transform = new TransformApiGatewayRequest(request);
    const data = transform.getRequest();
    expect(data.cognitoAccessToken).toEqual(headerLowercaseStub['access-token']);
  }); // end of return access token

  it('should return id token', () => {
    const request: APIGatewayProxyEvent = {
      body: JSON.stringify({ data: '123' }),
      headers: headerLowercaseStub,
    } as APIGatewayProxyEvent;

    const transform = new TransformApiGatewayRequest(request);
    const data = transform.getRequest();
    expect(data.cognitoIdToken).toEqual(headerLowercaseStub.authorization.replace('Bearer ', ''));
  }); // end of return id token from auth header

  it('should transform the request with device ID when the FCM token is not available', () => {
    const request: APIGatewayProxyEvent = ({
      body: JSON.stringify({ data: '123' }),
      headers: { ...headerLowercaseStub, 'fcm-token': undefined },
    } as unknown) as APIGatewayProxyEvent;

    const transform = new TransformApiGatewayRequest(request);
    const data = transform.getRequest();
    expect(data.fcmToken).toEqual(headerLowercaseStub['device-id']);
  });
});

describe('Transform ApiGatewayEvent with encoded path params', () => {
  it('should return normal params', () => {
    const request: APIGatewayProxyEvent = ({
      body: JSON.stringify({ data: '123' }),
      headers: headerLowercaseStub,
      pathParameters: {
        pathParamName: 'idWithoutEncoding',
      },
    } as unknown) as APIGatewayProxyEvent;

    const transform = new TransformApiGatewayRequest(request);
    const data = transform.getRequest();
    expect(data.params.pathParamName).toEqual('idWithoutEncoding');
  });

  it('should return encoded params decoded', () => {
    const request: APIGatewayProxyEvent = ({
      body: JSON.stringify({ data: '123' }),
      headers: headerLowercaseStub,
      pathParameters: {
        pathParamName: 'id%20with%20spaces',
      },
    } as unknown) as APIGatewayProxyEvent;

    const transform = new TransformApiGatewayRequest(request);
    const data = transform.getRequest();
    expect(data.params.pathParamName).toEqual('id with spaces');
  });

  it('should decode and parse the body as jsonBody when it is base64 encoded', () => {
    const request: APIGatewayProxyEvent = ({
      body: 'eyJ0ZXN0IjoieWVzIn0=',
      isBase64Encoded: true,
      headers: headerLowercaseStub,
    } as unknown) as APIGatewayProxyEvent;

    const transform = new TransformApiGatewayRequest(request);
    const data = transform.getRequest();
    expect(data.jsonBody).toMatchObject({ test: 'yes' });
  });

  it('should parse the body as jsonBody when the body is not base64 encoded', () => {
    const request: APIGatewayProxyEvent = ({
      body: '{"test":"yes"}',
      isBase64Encoded: false,
      headers: headerLowercaseStub,
    } as unknown) as APIGatewayProxyEvent;

    const transform = new TransformApiGatewayRequest(request);
    const data = transform.getRequest();
    expect(data.jsonBody).toMatchObject({ test: 'yes' });
  });

  it('should return an empty jsonBody when the body is not present', () => {
    const request: APIGatewayProxyEvent = ({
      headers: headerLowercaseStub,
    } as unknown) as APIGatewayProxyEvent;

    const transform = new TransformApiGatewayRequest(request);
    const data = transform.getRequest();
    expect(data.jsonBody).toMatchObject({});
  });

  it('should return an empty jsonBody when the body is not json parsable', () => {
    const request: APIGatewayProxyEvent = ({
      body: 'test',
      headers: headerLowercaseStub,
    } as unknown) as APIGatewayProxyEvent;

    const transform = new TransformApiGatewayRequest(request);
    const data = transform.getRequest();
    expect(data.jsonBody).toMatchObject({});
  });
});
