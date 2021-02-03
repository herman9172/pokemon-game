import { CoreErrorCodes, HttpStatusCode } from '@core/enterprise_business_rules/constants';
import { BaseError, ErrorTypes } from '@core/enterprise_business_rules/entities/errors';

describe('Base error', () => {
  it('should define error correctly', () => {
    const notFound = new BaseError({
      type: ErrorTypes.ServerError,
      httpStatus: HttpStatusCode.INTERNAL_SERVER_ERROR,
      message: 'fake base error',
      traceId: '123',
      code: CoreErrorCodes.UNKNOWN,
    });

    expect(notFound.httpStatus).toBe(500);
    expect(notFound.message).toBe('fake base error');
  });
});
