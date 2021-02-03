import { HttpStatusCode } from '@core/enterprise_business_rules/constants/httpCodes';
import {
  BaseError,
  ErrorCode,
  ErrorTypes,
  ICustomError,
} from '@core/enterprise_business_rules/entities/errors/baseError';

export class ServerError extends BaseError {
  constructor(message: string, code: ErrorCode, httpStatus?: HttpStatusCode, traceId?: string) {
    const error: ICustomError = {
      type: ErrorTypes.ServerError,
      httpStatus: httpStatus || HttpStatusCode.INTERNAL_SERVER_ERROR,
      message,
      traceId,
      code,
    };
    super(error);
  }
}
