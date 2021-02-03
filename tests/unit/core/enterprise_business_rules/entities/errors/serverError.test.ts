import { ServerError } from '@core/enterprise_business_rules/entities/errors';

describe('Server error', () => {
  it('should define error correctly', () => {
    const notFound = new ServerError('server error found', undefined);
    expect(notFound.httpStatus).toBe(500);
    expect(notFound.message).toBe('server error found');
  });
});
