// istanbul ignore file

import { IRequest } from '@core/enterprise_business_rules/api_contract';
import { CoreErrorCodes } from '@core/enterprise_business_rules/constants';
import { BaseError, ServerError } from '@core/enterprise_business_rules/entities/errors';
import { ILogRepository, IRequestErrorHandler } from '@core/interface_adapters/adapters';

export class RequestErrorHandler implements IRequestErrorHandler {
  constructor(private readonly logRepository: ILogRepository) {}

  handleError(error: BaseError, request: IRequest): Error {
    let customError = error;
    if (!(customError instanceof BaseError)) {
      customError = new ServerError(error.message, CoreErrorCodes.UNKNOWN);
    }
    this.logRepository.error({
      method: 'RequestErrorHandler.handleError',
      message: error.message,
      data: { error: customError.serialize(), request },
    });

    return customError;
  }
}
