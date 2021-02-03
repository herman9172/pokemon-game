import { DatabaseError } from '@core/enterprise_business_rules/entities/errors';
import { BaseError, ErrorTypes } from '@core/enterprise_business_rules/entities/errors/baseError';

describe('Database error', () => {
  it('should define error message correctly', () => {
    expect.hasAssertions();
    const dbServerError = new DatabaseError({
      code: 'ER_PARSE_ERROR',
      errno: 1064,
      message: 'You have an error in your SQL syntax',
      sqlState: '42000',
      fatal: false,
      name: 'Error',
    });
    expect(dbServerError).toBeInstanceOf(BaseError);
    expect(dbServerError.type).toEqual(ErrorTypes.DatabaseError);
  });

  it('should define error message without status code correctly', () => {
    expect.hasAssertions();
    const dbServerError = new DatabaseError({
      code: 'ER_MULTIPLE_PRI_KEY',
      errno: 1068,
      message: 'Multiple primary key defined',
      sqlState: '42000',
      fatal: false,
      name: 'Error',
    });
    expect(dbServerError).toBeInstanceOf(BaseError);
    expect(dbServerError.type).toEqual(ErrorTypes.DatabaseError);
  });
});
