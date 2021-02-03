import { MiddlewareFunction, use } from '@core/application_business_rules/decorators';
import { IRequest } from '@core/enterprise_business_rules/api_contract';
import { IServices } from '@lib/framework_drivers/config/app';
import { iRequestStub } from '@tests/stubs/requestStubs';
import { servicesStub } from '@tests/stubs/servicesStubs';

describe('Use Middleware Decorator', () => {
  it('should call a middleware before executing the function', async () => {
    expect.assertions(2);

    const fakeCallback = jest.fn();
    const middleware: MiddlewareFunction = (_request: IRequest, _services: IServices) => {
      expect(fakeCallback).not.toHaveBeenCalled();
    };

    class FakeClass {
      @use(middleware)
      static async foo(_request: IRequest, _services: IServices): Promise<void> {
        await fakeCallback();
      }
    }

    await FakeClass.foo(iRequestStub, servicesStub);
    expect(fakeCallback).toHaveBeenCalledTimes(1);
  });

  it('should call multiple middleware in the order they were included before executing the function', async () => {
    expect.assertions(7);

    const fakeCallback = jest.fn();
    const fakeMiddleware1 = jest.fn();
    const fakeMiddleware2 = jest.fn();
    const middleware1: MiddlewareFunction = (_request: IRequest, _services: IServices) => {
      fakeMiddleware1();
      expect(fakeCallback).not.toHaveBeenCalled();
      expect(fakeMiddleware2).not.toHaveBeenCalled();
    };

    const middleware2: MiddlewareFunction = (_request: IRequest, _services: IServices) => {
      fakeMiddleware2();
      expect(fakeMiddleware1).toHaveBeenCalledTimes(1);
      expect(fakeCallback).not.toHaveBeenCalled();
    };

    class FakeClass {
      @use(middleware1)
      @use(middleware2)
      static async foo(_request: IRequest, _services: IServices): Promise<void> {
        await fakeCallback();
      }
    }

    await FakeClass.foo(iRequestStub, servicesStub);
    expect(fakeCallback).toHaveBeenCalledTimes(1);
    expect(fakeMiddleware1).toHaveBeenCalledTimes(1);
    expect(fakeMiddleware2).toHaveBeenCalledTimes(1);
  });
});
