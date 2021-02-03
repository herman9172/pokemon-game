import { axiosCore } from '@config/axiosCore';
import { RequestRepository } from '@core/interface_adapters/adapters';
import { loggerRepositoryStub } from '@tests/stubs/coreStubs';
import { requestStub } from '@tests/stubs/requestStubs';
import MockAdapter from 'axios-mock-adapter';

describe('Request Repository', () => {
  let requestRepository: RequestRepository;
  beforeEach(() => {
    requestRepository = new RequestRepository(requestStub, loggerRepositoryStub);
  });

  it('should do Post', async () => {
    const mock = new MockAdapter(axiosCore);
    mock.onPost(requestStub.url).reply(200, requestStub.data);

    const result = await requestRepository.doPost(requestStub.url, requestStub.data, requestStub.headers);
    expect(result).toEqual(requestStub.data);
  });

  it('should do Get', async () => {
    const mock = new MockAdapter(axiosCore);
    mock.onGet(requestStub.url).reply(200, requestStub.data);

    const result = await requestRepository.doGet(requestStub.url, requestStub.data, requestStub.headers);
    expect(result).toEqual(requestStub.data);
  });

  it('should do put', async () => {
    const mock = new MockAdapter(axiosCore);
    mock.onPut(requestStub.url).reply(200, requestStub.data);

    const result = await requestRepository.doPut(requestStub.url, requestStub.data, requestStub.headers);
    expect(result).toEqual(requestStub.data);
  });

  it('should do delete', async () => {
    const mock = new MockAdapter(axiosCore);
    mock.onDelete(requestStub.url).reply(200, requestStub.data);

    const result = await requestRepository.doDelete(requestStub.url, requestStub.data, requestStub.headers);
    expect(result).toEqual(requestStub.data);
  });
});
