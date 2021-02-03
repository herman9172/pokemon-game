import { IRequest, IResponse } from '@core/enterprise_business_rules/api_contract';
import { IServices } from '@lib/framework_drivers/config/app';

export type MiddlewareFunction = (request: IRequest, services: IServices) => any;
export const use = (middleware: MiddlewareFunction): any => (
  _target: any,
  _propertyKey: string,
  descriptor: PropertyDescriptor,
) => {
  const originalMethod = descriptor.value;

  // tslint:disable-next-line:only-arrow-functions
  descriptor.value = async function(...args: Array<any>): Promise<IResponse> {
    const [request, services] = args;
    await middleware(request, services);

    // tslint:disable-next-line:no-invalid-this
    return originalMethod.apply(this, args);
  };
};
