import { NotFoundError } from '@core/enterprise_business_rules/entities/errors';

describe('Not found error', () => {
  it('should define error correctly', () => {
    const notFound = new NotFoundError('User not found', undefined);
    expect(notFound.httpStatus).toBe(404);
    expect(notFound.message).toBe('User not found');
  });
});
