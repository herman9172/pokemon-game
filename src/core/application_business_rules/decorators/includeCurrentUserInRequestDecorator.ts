// istanbul ignore file
// TODO: ENABLE COVERAGE WHEN THIS DECORATOR IS FINISHED

// tslint:disable:no-invalid-this
import { IRequest, IResponse } from '@core/enterprise_business_rules/api_contract';

export const includeCurrentUserInRequest = (
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
): any => {
  const originalMethod = descriptor.value;

  // tslint:disable-next-line:only-arrow-functions
  descriptor.value = async function(...args: Array<any>): Promise<IResponse> {
    // tslint:disable-next-line:ban-ts-ignore - Remove TS Ignore after using services
    // @ts-ignore
    const [requestArgs, _services] = args;

    const request = requestArgs as IRequest;
    request.currentUser = {
      name: 'TODO',
    };
    // TODO: Call services.userIdentityRepository to get current user from the cognito token

    // tslint:disable-next-line:no-invalid-this
    return originalMethod.apply(this, args);
  };

  return descriptor;
};
