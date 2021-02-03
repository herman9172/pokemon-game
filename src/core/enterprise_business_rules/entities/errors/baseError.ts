import { CognitoErrorCodes } from '@core/enterprise_business_rules/constants/errorCodes/cognitoErrorCodes';
import { CoreErrorCodes } from '@core/enterprise_business_rules/constants/errorCodes/coreErrorCodes';
import { HttpStatusCode } from '@core/enterprise_business_rules/constants/httpCodes';
import { CustomError } from 'ts-custom-error';

export enum ErrorTypes {
  ConflictError = 'ConflictError',
  ForbiddenError = 'ForbiddenError',
  DatabaseError = 'DatabaseError',
  MQServerError = 'MQServerError',
  HMACError = 'HMACError',
  HTTPError = 'HTTPError',
  NotFound = 'NotFound',
  ServerError = 'ServerError',
  UnprocessableEntity = 'UnprocessableEntity',
  ValidationError = 'ValidationError',
  GatewayTimeout = 'GatewayTimeout',
}

export type ErrorCode = CoreErrorCodes | CognitoErrorCodes;

export interface ICustomError {
  type: ErrorTypes;
  httpStatus: HttpStatusCode;
  message: string;
  traceId?: string;
  code?: ErrorCode;
  errors?: { [key: string]: Array<any> };
}

export class BaseError extends CustomError implements ICustomError {
  type: ErrorTypes;
  httpStatus: HttpStatusCode;
  name: string;
  detail: string;
  traceId?: string;
  code?: ErrorCode;

  static serialize(error: Error, includeStackTrace = false): any {
    const serializedError = JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    if (!includeStackTrace) {
      serializedError.stack = undefined;
    }

    return serializedError;
  }

  constructor(customError: ICustomError) {
    super(customError.message);
    this.detail = customError.message;
    this.type = customError.type;
    this.httpStatus = customError.httpStatus;
    this.traceId = customError.traceId;
    this.code = customError.code;
  }

  serialize(includeStackTrace = false): any {
    return BaseError.serialize(this, includeStackTrace);
  }
}
