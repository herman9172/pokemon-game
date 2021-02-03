// tslint:disable:no-empty
import { Catch, handleError, HandlerFunction } from '@core/application_business_rules/decorators/catchDecorator';
import { BaseError } from '@core/enterprise_business_rules/entities/errors/baseError';
import { ValidationError } from '@core/enterprise_business_rules/entities/errors/validationError';

describe('Catch Decorator', () => {
  it('should handle unhandled errors', () => {
    expect.assertions(3);
    const handlerFunction = (err: BaseError, _ctx: any, _args: any) => {
      expect(err.httpStatus).toBeDefined();
      expect(err.detail).toBeDefined();
      expect(err.message).toBeDefined();
    };
    handleError(undefined, handlerFunction, new Error('Cookies and Cream'), []);
  });

  it('should handle custom errors', () => {
    expect.assertions(3);
    const handlerFunction = (err: BaseError, _ctx: any, _args: any) => {
      expect(err.httpStatus).toBeDefined();
      expect(err.detail).toBeDefined();
      expect(err.message).toBeDefined();
    };
    handleError(undefined, handlerFunction, new ValidationError('Cookies and Cream', undefined), []);
  });

  it('should return value if no error', async () => {
    const handlerFunction: HandlerFunction = (_err: BaseError, _ctx: any, _args: any) => {};

    const val = await Catch(handlerFunction)(undefined, undefined, {
      value: () => 'my value',
    }).value();

    expect(val).toEqual('my value');
  });

  it('should handle error', () => {
    expect.assertions(2);
    const handlerFunction: HandlerFunction = (err: BaseError, _ctx: any, _args: any) => {
      expect(err.httpStatus).toBeDefined();
      expect(err.detail).toEqual('my bad');
    };

    Catch(handlerFunction)(undefined, undefined, {
      value: () => {
        throw new ValidationError('my bad', undefined);
      },
    }).value();
  });

  it('should handle promise error', () => {
    expect.assertions(2);
    const handlerFunction: HandlerFunction = (err: BaseError, _ctx: any, _args: any) => {
      expect(err.httpStatus).toBeDefined();
      expect(err.detail).toEqual('my bad');
    };

    Catch(handlerFunction)(undefined, undefined, {
      value: async () => {
        await Promise.resolve(true);
        throw new ValidationError('my bad', undefined);
      },
    }).value();
  });
});
