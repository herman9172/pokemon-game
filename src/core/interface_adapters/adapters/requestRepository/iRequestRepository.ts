export interface IRequestRepository {
  doPost(url: string, data?: any, headers?: { [name: string]: string }): Promise<any>;
  doPut(url: string, data?: any, headers?: { [name: string]: string }): Promise<any>;
  doGet(url: string, params?: any, headers?: { [name: string]: string }): Promise<any>;
  doDelete(url: string, params?: any, headers?: { [name: string]: string }): Promise<any>;
}
