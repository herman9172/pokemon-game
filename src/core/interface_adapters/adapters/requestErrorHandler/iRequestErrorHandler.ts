import { IRequest } from '@core/enterprise_business_rules/api_contract';

export interface IRequestErrorHandler {
  handleError(error: Error, request: IRequest): Error;
}
