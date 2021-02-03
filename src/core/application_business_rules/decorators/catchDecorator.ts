// tslint:disable:no-invalid-this variable-name

import { CoreErrorCodes } from '@core/enterprise_business_rules/constants';
import { BaseError, ServerError } from '@core/enterprise_business_rules/entities/errors';

export type HandlerFunction = (error: BaseError, ctx: any, args: any) => void;
export const handleError = (context: any, handler: HandlerFunction, error: any, args: any) => {
  const apiError = error instanceof BaseError ? error : new ServerError(error.message, CoreErrorCodes.UNKNOWN);

  // run handler with error object
  // and class context as second argument
  return handler.call(undefined, apiError, context, args);
};

export const Catch = (handler: HandlerFunction): any => (
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  // save a reference to the original method
  const originalMethod = descriptor.value;

  // rewrite original method with custom wrapper
  descriptor.value = async function(...args: Array<any>): Promise<any> {
    try {
      const result = originalMethod.apply(this, args);
      // check if method is asynchronous
      if (result && typeof result.then === 'function' && typeof result.catch === 'function') {
        // return promise
        return result.catch((error: any) => handleError(this, handler, error, args));
      }

      // return actual result
      return result;
    } catch (error) {
      // tslint:disable-next-line:no-invalid-this
      return handleError(this, handler, error, args);
    }
  };

  return descriptor;
};
