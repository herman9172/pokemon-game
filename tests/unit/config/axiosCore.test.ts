import { axiosCore } from '@config/axiosCore';
import { GatewayTimeoutError } from '@core/enterprise_business_rules/entities/errors/gatewayTimeoutError';
import MockAdapter from 'axios-mock-adapter';

const testUrl = 'http://test.url.com';
describe('Axios core instance suite', () => {
  it('Should return a response correctly', async () => {
    const mock = new MockAdapter(axiosCore);
    mock.onGet(testUrl).reply(200, { data: 'test' });

    await axiosCore.get(testUrl);
  }); // end of return a response correctly

  it('Should fail with timeout', async () => {
    const mock = new MockAdapter(axiosCore);
    mock.onGet(testUrl).timeout();

    await expect(axiosCore.get(testUrl)).rejects.toThrowError(GatewayTimeoutError);
  }); // end of fail with timeout

  it('Should fail with other error than timeout', async () => {
    const mock = new MockAdapter(axiosCore);
    mock.onGet(testUrl).networkError();

    await expect(axiosCore.get(testUrl)).rejects.toThrowError(Error);
  }); // end of fail with other error than timeout

  it('Should fail with custom error', async () => {
    const mock = new MockAdapter(axiosCore);
    mock.onGet(testUrl).reply(500);

    await expect(axiosCore.get(testUrl)).rejects.toThrow();
  }); // end of fail with custom error
});
