import { HttpStatusCode } from '@core/enterprise_business_rules/constants/httpCodes';
import {
  BaseError, ErrorCode,
  ErrorTypes,
  ICustomError,
} from '@core/enterprise_business_rules/entities/errors/baseError';

export class NotFoundError extends BaseError {
  constructor(message: string, code: ErrorCode, traceId?: string) {
    const error: ICustomError = {
      type: ErrorTypes.NotFound,
      httpStatus: HttpStatusCode.NOT_FOUND,
      message,
      traceId,
      code,
    };
    super(error);
  }
}
