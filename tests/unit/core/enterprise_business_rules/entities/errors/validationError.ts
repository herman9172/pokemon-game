import { ValidationError } from '@core/enterprise_business_rules/entities/errors';

describe('Validation error', () => {
  it('should define error correctly', () => {
    const notFound = new ValidationError('validation error', undefined);
    expect(notFound.httpStatus).toBe(400);
    expect(notFound.message).toBe('validation error');
  });
});
