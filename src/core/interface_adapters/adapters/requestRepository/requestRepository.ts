import { axiosCore } from '@config/axiosCore';
import { IRequest } from '@core/enterprise_business_rules/api_contract';
import { HttpMethod } from '@core/enterprise_business_rules/constants';
import { BaseError } from '@core/enterprise_business_rules/entities/errors';
import { ILogRepository } from '@core/interface_adapters/adapters/logRepository/iLogRepository';
import { IRequestRepository } from '@core/interface_adapters/adapters/requestRepository/iRequestRepository';

export class RequestRepository implements IRequestRepository {
  private static mapRequestError(err: any): BaseError {
    const responseError = err?.response;

    return new BaseError({
      httpStatus: responseError?.status,
      type: responseError?.type,
      message: responseError?.data?.detail || responseError?.statusText,
      code: responseError?.data?.code,
    });
  }
  constructor(private readonly request: IRequest, private readonly logRepository: ILogRepository) {}

  async doPost(url: string, data?: any, headers?: { [name: string]: string }): Promise<any> {
    this.logRepository.debug({ method: 'RequestRepository.doPost', data: { url, data, headers } });

    return this.doRequest(HttpMethod.POST, url, data, headers);
  }

  async doGet(url: string, params?: any, headers?: { [name: string]: string }): Promise<any> {
    this.logRepository.debug({ method: 'RequestRepository.doPost', data: { url, params, headers } });

    return this.doRequest(HttpMethod.GET, url, params, headers);
  }

  async doDelete(url: string, params?: any, headers?: { [name: string]: string }): Promise<any> {
    this.logRepository.debug({ method: 'RequestRepository.doPost', data: { url, params, headers } });

    return this.doRequest(HttpMethod.DELETE, url, params, headers);
  }

  async doPut(url: string, data?: any, headers?: { [name: string]: string }): Promise<any> {
    this.logRepository.debug({ method: 'RequestRepository.doPost', data: { url, data, headers } });

    return this.doRequest(HttpMethod.PUT, url, data, headers);
  }

  private async doRequest(verb: HttpMethod, url: string, params?: any, headers?: any): Promise<any> {
    const startTime = Date.now();

    const requestHeaders = headers || this.getCognitoRequestHeaders();
    try {
      let result;
      switch (verb) {
        case HttpMethod.GET:
          result = await axiosCore.get(url, { params, headers: requestHeaders });
          break;
        case HttpMethod.POST:
          result = await axiosCore.post(url, params, { headers: requestHeaders });
          break;
        case HttpMethod.PUT:
          result = await axiosCore.put(url, params, { headers: requestHeaders });
          break;
        case HttpMethod.DELETE:
          result = await axiosCore.delete(url, { params, headers: requestHeaders });
          break;
        default:
          throw new TypeError('Not implemented verb');
      }

      return result?.data;
    } catch (err) {
      this.logRepository.error({
        method: 'RequestRepository.doRequest',
        message: 'An error occurred in the request',
        data: { error: err?.response?.statusText },
      });
      throw RequestRepository.mapRequestError(err);
    } finally {
      this.logElapsedTime(verb, url, startTime);
    }
  }

  private logElapsedTime(method: string, url: string, startTime: number): void {
    const endTime = Date.now();
    const elapsedTime = `${(endTime - startTime).toFixed()}ms`;

    this.logRepository.debug({
      method: 'RequestRepository.logElapsedTime',
      message: `${method} elapsedTime`,
      data: { method, url, startTime, endTime, elapsedTime },
    });
  }

  private getCognitoRequestHeaders(): any {
    const headers: any = {};
    if (this.request.cognitoIdToken) {
      headers.Authorization = `Bearer ${this.request.cognitoIdToken}`;
    }

    if (this.request.cognitoAccessToken) {
      headers['Access-Token'] = this.request.cognitoAccessToken;
    }

    return headers;
  }
}
