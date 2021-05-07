// istanbul ignore file

import { HttpStatusCode } from '@core/enterprise_business_rules/constants/';
import {
  BaseError,
  ErrorCode,
  ErrorTypes,
  ICustomError,
} from '@core/enterprise_business_rules/entities/errors/baseError';

export class ConflictError extends BaseError {
  constructor(message: string, code: ErrorCode, traceId?: string) {
    const error: ICustomError = {
      type: ErrorTypes.ConflictError,
      httpStatus: HttpStatusCode.CONFLICT,
      message,
      traceId,
      code,
    };
    super(error);
  }
}
