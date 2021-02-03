import { IRequest } from '@core/enterprise_business_rules/api_contract';
import { APIGatewayEvent, Context } from 'aws-lambda';
import uuid from 'uuid';

export class TransformApiGatewayRequest {
  private static getJsonBody(body: any, isBase64Encoded: boolean): any {
    const decodedBody = (body && isBase64Encoded && Buffer.from(body, 'base64').toString()) || body;
    try {
      const parsedBody = decodedBody && decodedBody !== '' && JSON.parse(decodedBody);

      return parsedBody || {};
    } catch (e) {
      return {};
    }
  }
  constructor(private readonly apiGatewayEvent?: APIGatewayEvent, private readonly lambdaContext?: Context) {}

  getRequest(): IRequest {
    const { headers, body, isBase64Encoded } = this.apiGatewayEvent || {};

    return {
      body,
      jsonBody: TransformApiGatewayRequest.getJsonBody(body, isBase64Encoded),
      params: this.getParams(),
      queryStringParams: this.apiGatewayEvent?.queryStringParameters,
      cognitoAccessToken: headers?.['Access-Token'] || headers?.['access-token'],
      cognitoIdToken: this.getIdToken(),
      traceId: headers?.['Trace-Id'] || headers?.['trace-id'] || uuid(),
      deviceId: headers?.['Unique-Device-Id'] || headers?.['unique-device-id'],
      fcmToken: headers?.['Fcm-Token'] || headers?.['fcm-token'] || headers?.['Device-Id'] || headers?.['device-id'],
      deviceOs: (headers?.['Device-Os'] || headers?.['device-os'])?.toLowerCase(),
      sourceIp: this.apiGatewayEvent?.requestContext?.identity?.sourceIp,
      version: headers?.Version || headers?.version,
      path: this.apiGatewayEvent?.path,
      method: this.apiGatewayEvent?.httpMethod?.toUpperCase(),
      timestamp: headers?.['X-Auth-Timestamp'] || headers?.['x-auth-timestamp'],
      apiKey: headers?.['X-Auth'] || headers?.['x-auth'],
      signature: headers?.['X-Auth-Signature'] || headers?.['x-auth-signature'],
      nonce: headers?.['X-Auth-Nonce'] || headers?.['x-auth-nonce'],
      awsRequestId: this.lambdaContext?.awsRequestId,
      awsFunctionName: this.lambdaContext?.functionName,
      stage: this.apiGatewayEvent?.requestContext?.stage,
    };
  }

  private getParams(): any {
    const pathParameters = this.apiGatewayEvent?.pathParameters;

    return (
      pathParameters &&
      Object.keys(pathParameters).reduce(
        (encodedParams, key) => ({
          ...encodedParams,
          [key]: decodeURIComponent(pathParameters[key]),
        }),
        {},
      )
    );
  }

  private getIdToken(): string {
    const authHeader = this.apiGatewayEvent?.headers?.Authorization || this.apiGatewayEvent?.headers?.authorization;

    return authHeader?.replace('Bearer ', '').trim();
  }
}
