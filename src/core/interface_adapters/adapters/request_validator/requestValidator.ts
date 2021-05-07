// istanbul ignore file

import { CoreErrorCodes } from '@core/enterprise_business_rules/constants';
import { ValidationError as SystemValidationError } from '@core/enterprise_business_rules/entities/errors/validationError';
import { IRequestValidator } from '@core/interface_adapters/adapters/request_validator/iRequestValidator';
import { validateOrReject, ValidationError } from 'class-validator';

export class RequestValidator implements IRequestValidator {
  async validate<T>(object: T): Promise<void> {
    try {
      await validateOrReject(object, { dismissDefaultMessages: true });
    } catch (e) {
      const searchForErrors = (error: ValidationError) => {
        if (!error.constraints) {
          return error.children.map((childError: ValidationError) => ({
            [error.property]: searchForErrors(childError),
          }));
        }

        return Object.values(error.constraints);
      };

      const errors = {};
      e.forEach((error: ValidationError) => {
        errors[error.property] = searchForErrors(error);
      });

      for (const field of Object.keys(errors)) {
        if (typeof errors[field][0] !== 'string') {
          const messages = {};
          errors[field].forEach((message) => {
            Object.assign(messages, message);
          });

          errors[field] = messages;
        }
      }

      // Get first error message validation
      let defaultMessage;
      for (const field of Object.keys(errors)) {
        defaultMessage = errors[field][0] || 'Error de validación';
        break;
      }

      throw new SystemValidationError(defaultMessage, CoreErrorCodes.ROUTE_VALIDATION_ERROR, undefined, errors);
    }
  }
}
