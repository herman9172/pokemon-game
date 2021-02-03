import { IResponse } from '@core/enterprise_business_rules/api_contract';
import { IInvoke } from '@core/interface_adapters/adapters/invokeRepository/invokeRepository';

export interface IInvokeRepository {
  invokeEvent(functionName: string, payload: IInvoke): Promise<IResponse>;
  invokeResponse(functionName: string, payload: IInvoke): Promise<IResponse>;
}
