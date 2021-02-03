import { CoreErrorCodes } from '@core/enterprise_business_rules/constants';
import { NotFoundError } from '@core/enterprise_business_rules/entities/errors';
import { RequestErrorHandler } from '@core/interface_adapters/adapters';
import { iRequestStub } from '@tests/stubs/requestStubs';
import { loggerRepositoryStub } from '@tests/stubs/servicesStubs';

describe('Request Error Handler', () => {
  it('should log the error', () => {
    const logError = spyOn(loggerRepositoryStub, 'error');

    const requestErrorHandler = new RequestErrorHandler(loggerRepositoryStub);
    const errorToHandle = new NotFoundError('fake error', CoreErrorCodes.UNKNOWN);

    requestErrorHandler.handleError(errorToHandle, iRequestStub);

    expect(logError).toHaveBeenCalledTimes(1);
  });

  it('should return the same error', () => {
    const requestErrorHandler = new RequestErrorHandler(loggerRepositoryStub);
    const errorToHandle = new NotFoundError('fake error', CoreErrorCodes.UNKNOWN);

    const returnedError = requestErrorHandler.handleError(errorToHandle, iRequestStub);

    expect(returnedError).toEqual(errorToHandle);
  });
});
