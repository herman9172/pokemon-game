export interface IDictionary<T> {
  [propertyName: string]: T;
}

export interface IRequest {
  body?: string;
  jsonBody?: any;
  params?: IDictionary<string>;
  queryStringParams?: IDictionary<string>;
  cognitoAccessToken?: string;
  cognitoIdToken?: string;
  currentUser?: any; // TODO: DEFINE ENTITY. THIS SHOULD BE INJECTED
  traceId?: string;
  deviceId?: string;
  fcmToken?: string;
  deviceBrand?: string;
  deviceModel?: string;
  deviceOs?: string;
  sourceIp?: string;
  version?: string;
  path?: string;
  method?: 'POST' | 'GET' | 'DELETE' | 'PUT' | string;
  timestamp?: string;
  apiKey?: string;
  signature?: string;
  nonce?: string;
  ip?: string;
  userAgent?: string;
  awsRequestId?: string;
  awsFunctionName?: string;
  stage?: string;
}
