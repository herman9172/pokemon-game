import { HttpStatusCode } from '@core/enterprise_business_rules/constants';
import {
  BaseError,
  ErrorCode,
  ErrorTypes,
  ICustomError,
} from '@core/enterprise_business_rules/entities/errors/baseError';

export class ValidationError extends BaseError {
  constructor(message: string, code: ErrorCode, traceId?: string, errors?: { [key: string]: Array<any> }) {
    const error: ICustomError = {
      type: ErrorTypes.ValidationError,
      httpStatus: HttpStatusCode.BAD_REQUEST,
      message,
      traceId,
      code,
      errors,
    };
    super(error);
  }
}
