export interface IResponse {
  statusCode: number;
  body: string;
  headers?: any;
}

export type HttpResponse<T> = Promise<T | IResponse>;
