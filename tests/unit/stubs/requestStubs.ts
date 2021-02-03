import { IRequest } from '@core/enterprise_business_rules/api_contract/';
import { APIGatewayProxyEvent, Context } from 'aws-lambda';

export const headerStub: { [name: string]: any } = {
  Authorization:
    'Bearer eyJraWQiOiJCNTdtWDdwd0lVbDdIenRrdGJ1eEVyblZVVUhnbmFQemIxbnNOMmdGVnVJPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiSVZCRndEeGJ1aGVtV09KTE1JYlljdyIsInN1YiI6IjJkZTJiZTk1LTE1YTEtNDAxYi1hNjQwLTQzOWQwNDU4YTdlOCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfU0JHR0tDSHRjIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnVzZXJuYW1lIjoiMmRlMmJlOTUtMTVhMS00MDFiLWE2NDAtNDM5ZDA0NThhN2U4IiwiYXVkIjoiM3BkaGhjMHQwOG9ncWFvYnRvdThhcWJhbGUiLCJldmVudF9pZCI6IjE3NWZlYmZmLTE2MTYtNGI4NC05NGZlLWEyNzMxNjVmMGQxMyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTc1NDc2NDMxLCJuYW1lIjoiQWxraW5zb24iLCJwaG9uZV9udW1iZXIiOiIrNTA2ODQ0NDA4ODAiLCJleHAiOjE1NzU0ODAwMzEsImlhdCI6MTU3NTQ3NjQzMSwiZmFtaWx5X25hbWUiOiJHb256YWxleiIsImVtYWlsIjoiYWxraW5zb24ubGFpbmVyQG9tbmkuY3IifQ.c3iwBK4TCS9yfSAmM1nPG33TLF8apQB4lUVeMmBOEIUgXafh1v8fOGgSEIzMloRNs-SvubtCEb117EKPjt2CvnZeTyX1Kz97Rjmrk-B_hzwX5AOPoeg3W1CiZZwDOi52VHgTIDPKzoKidlld5lwT7BOMGGPNi1yiZ3_suN3ACg5b3wG3Y9ephKSGn4IrYGp4matE-mGctHMbdKu4nu8jYf1qmm3HGAhy3cw3Sj1LnHNjabZQMrfkwc5nIYcFye8XrtfHfa7uaVRLONsfVjFvhtyYYjR3RXEfHiXJvvJ40-qBi7AtiXqKMxQgMeSiQOSKSS5hmd0DMBTOwMiBAQcD_A',
  'Access-Token':
    'eyJraWQiOiJCNTdtWDdwd0lVbDdIenRrdGJ1eEVyblZVVUhnbmFQemIxbnNOMmdGVnVJPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiSVZCRndEeGJ1aGVtV09KTE1JYlljdyIsInN1YiI6IjJkZTJiZTk1LTE1YTEtNDAxYi1hNjQwLTQzOWQwNDU4YTdlOCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfU0JHR0tDSHRjIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnVzZXJuYW1lIjoiMmRlMmJlOTUtMTVhMS00MDFiLWE2NDAtNDM5ZDA0NThhN2U4IiwiYXVkIjoiM3BkaGhjMHQwOG9ncWFvYnRvdThhcWJhbGUiLCJldmVudF9pZCI6IjE3NWZlYmZmLTE2MTYtNGI4NC05NGZlLWEyNzMxNjVmMGQxMyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTc1NDc2NDMxLCJuYW1lIjoiQWxraW5zb24iLCJwaG9uZV9udW1iZXIiOiIrNTA2ODQ0NDA4ODAiLCJleHAiOjE1NzU0ODAwMzEsImlhdCI6MTU3NTQ3NjQzMSwiZmFtaWx5X25hbWUiOiJHb256YWxleiIsImVtYWlsIjoiYWxraW5zb24ubGFpbmVyQG9tbmkuY3IifQ.c3iwBK4TCS9yfSAmM1nPG33TLF8apQB4lUVeMmBOEIUgXafh1v8fOGgSEIzMloRNs-SvubtCEb117EKPjt2CvnZeTyX1Kz97Rjmrk-B_hzwX5AOPoeg3W1CiZZwDOi52VHgTIDPKzoKidlld5lwT7BOMGGPNi1yiZ3_suN3ACg5b3wG3Y9ephKSGn4IrYGp4matE-mGctHMbdKu4nu8jYf1qmm3HGAhy3cw3Sj1LnHNjabZQMrfkwc5nIYcFye8XrtfHfa7uaVRLONsfVjFvhtyYYjR3RXEfHiXJvvJ40-qBi7AtiXqKMxQgMeSiQOSKSS5hmd0DMBTOwMiBAQcD_A',
  Version: '1.1.0',
  Platform: 'Android',
  DeviceId: '1572383145046-6238673041136488816',
  pathParameters: "{ bikeId: '1' }",
  'X-Auth': '1234',
  'X-Auth-Timestamp': Date.now(),
  'X-Auth-Nonce': Math.random(),
  'X-Auth-Signature': 'SIGNATURE',
  'Device-Os': '123',
  'Device-Id': '123',
  'Fcm-Token': '123',
  'Trace-Id': '123',
};

export const headerLowercaseStub: { [name: string]: any } = {
  authorization:
    'Bearer eyJraWQiOiJCNTdtWDdwd0lVbDdIenRrdGJ1eEVyblZVVUhnbmFQemIxbnNOMmdGVnVJPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiSVZCRndEeGJ1aGVtV09KTE1JYlljdyIsInN1YiI6IjJkZTJiZTk1LTE1YTEtNDAxYi1hNjQwLTQzOWQwNDU4YTdlOCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfU0JHR0tDSHRjIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnVzZXJuYW1lIjoiMmRlMmJlOTUtMTVhMS00MDFiLWE2NDAtNDM5ZDA0NThhN2U4IiwiYXVkIjoiM3BkaGhjMHQwOG9ncWFvYnRvdThhcWJhbGUiLCJldmVudF9pZCI6IjE3NWZlYmZmLTE2MTYtNGI4NC05NGZlLWEyNzMxNjVmMGQxMyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTc1NDc2NDMxLCJuYW1lIjoiQWxraW5zb24iLCJwaG9uZV9udW1iZXIiOiIrNTA2ODQ0NDA4ODAiLCJleHAiOjE1NzU0ODAwMzEsImlhdCI6MTU3NTQ3NjQzMSwiZmFtaWx5X25hbWUiOiJHb256YWxleiIsImVtYWlsIjoiYWxraW5zb24ubGFpbmVyQG9tbmkuY3IifQ.c3iwBK4TCS9yfSAmM1nPG33TLF8apQB4lUVeMmBOEIUgXafh1v8fOGgSEIzMloRNs-SvubtCEb117EKPjt2CvnZeTyX1Kz97Rjmrk-B_hzwX5AOPoeg3W1CiZZwDOi52VHgTIDPKzoKidlld5lwT7BOMGGPNi1yiZ3_suN3ACg5b3wG3Y9ephKSGn4IrYGp4matE-mGctHMbdKu4nu8jYf1qmm3HGAhy3cw3Sj1LnHNjabZQMrfkwc5nIYcFye8XrtfHfa7uaVRLONsfVjFvhtyYYjR3RXEfHiXJvvJ40-qBi7AtiXqKMxQgMeSiQOSKSS5hmd0DMBTOwMiBAQcD_A',
  'access-token':
    'eyJraWQiOiJCNTdtWDdwd0lVbDdIenRrdGJ1eEVyblZVVUhnbmFQemIxbnNOMmdGVnVJPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiSVZCRndEeGJ1aGVtV09KTE1JYlljdyIsInN1YiI6IjJkZTJiZTk1LTE1YTEtNDAxYi1hNjQwLTQzOWQwNDU4YTdlOCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfU0JHR0tDSHRjIiwicGhvbmVfbnVtYmVyX3ZlcmlmaWVkIjp0cnVlLCJjb2duaXRvOnVzZXJuYW1lIjoiMmRlMmJlOTUtMTVhMS00MDFiLWE2NDAtNDM5ZDA0NThhN2U4IiwiYXVkIjoiM3BkaGhjMHQwOG9ncWFvYnRvdThhcWJhbGUiLCJldmVudF9pZCI6IjE3NWZlYmZmLTE2MTYtNGI4NC05NGZlLWEyNzMxNjVmMGQxMyIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNTc1NDc2NDMxLCJuYW1lIjoiQWxraW5zb24iLCJwaG9uZV9udW1iZXIiOiIrNTA2ODQ0NDA4ODAiLCJleHAiOjE1NzU0ODAwMzEsImlhdCI6MTU3NTQ3NjQzMSwiZmFtaWx5X25hbWUiOiJHb256YWxleiIsImVtYWlsIjoiYWxraW5zb24ubGFpbmVyQG9tbmkuY3IifQ.c3iwBK4TCS9yfSAmM1nPG33TLF8apQB4lUVeMmBOEIUgXafh1v8fOGgSEIzMloRNs-SvubtCEb117EKPjt2CvnZeTyX1Kz97Rjmrk-B_hzwX5AOPoeg3W1CiZZwDOi52VHgTIDPKzoKidlld5lwT7BOMGGPNi1yiZ3_suN3ACg5b3wG3Y9ephKSGn4IrYGp4matE-mGctHMbdKu4nu8jYf1qmm3HGAhy3cw3Sj1LnHNjabZQMrfkwc5nIYcFye8XrtfHfa7uaVRLONsfVjFvhtyYYjR3RXEfHiXJvvJ40-qBi7AtiXqKMxQgMeSiQOSKSS5hmd0DMBTOwMiBAQcD_A',
  version: '1.1.0',
  Platform: 'Android',
  DeviceId: '1572383145046-6238673041136488816',
  pathParameters: "{ bikeId: '1' }",
  'x-Auth': '1234',
  'x-auth-timestamp': Date.now(),
  'x-auth-nonce': Math.random(),
  'x-auth-signature': '123',
  'device-os': '123',
  'device-id': '123',
  'fcm-token': '123',
  'trace-id': '123',
};

const queryStringParametersStub: { [name: string]: string } = {
  status: '',
};

export const apiGatewayRequestStub: APIGatewayProxyEvent = {
  body: JSON.stringify({ data: '123' }),
  headers: headerStub,
  queryStringParameters: queryStringParametersStub,
  pathParameters: {},
} as APIGatewayProxyEvent;

export const lambdaContextStub: Context = {
  awsRequestId: '123',
  succeed: (_messageOrObject: any): void => {
    return;
  },
  done: (error?: Error, result?: any): void => {
    if (error) {
      return;
    }
    if (result) {
      return;
    }
  },
  fail: (_error: Error | string): void => {
    return;
  },
} as Context;

export const iRequestStub: IRequest = {
  cognitoAccessToken: '123',
  cognitoIdToken: '123',
  traceId: '123456',
  body: '{}',
  params: {},
  queryStringParams: {},
  version: '2.0.0',
};

export const awsApiErrorStub: AWS.AWSError = {
  message: 'Error message',
  code: 'Internal Server Error',
  retryable: false,
  statusCode: 500,
  time: new Date(),
  region: 'us-east-1',
  hostname: 'hostname',
  cfId: '1',
  extendedRequestId: '1',
  requestId: '1',
  retryDelay: 1,
  name: '',
};

export const requestStub = {
  url: 'http://localhost:8201',
  headers: {
    // platform: 'iOS',
    // version: '1.1.0',
  },
  data: {
    result: {
      merchantId: 307,
      accountTypeId: 2,
      documentNumber: '3123123123',
      comercialName: 'Omni Test 33',
      mainPhoneNumber: '44444444',
      mainEmail: 'pqwep@omni.cr',
      legalName: 'Omni test 33',
      iconAssetUrl: 'https://omnipay-qrimages-dev.s3.amazonaws.com/icons/307.png',
      status: 0,
      contact: {
        name: 'test X',
        id: 'd05720b9-fa0d-4ee9-ab45-b39d0ae0f895',
        email: 'julio.rojas@omni.cr',
        phone: 'm@m.com',
      },
      internetConnection: 'true',
      createdAt: '2020-09-07T15:34:42.000Z',
      mainEconomicActivity: 'Algo importante',
      totalPointOfSales: 4,
      totalStores: 51,
      totalUsers: 1,
    },
  },
  params: {},
};
