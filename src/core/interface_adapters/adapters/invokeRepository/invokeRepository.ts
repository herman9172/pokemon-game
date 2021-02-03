import { IResponse } from '@core/enterprise_business_rules/api_contract';
import { CoreErrorCodes, HttpMethod } from '@core/enterprise_business_rules/constants';
import { ServerError } from '@core/enterprise_business_rules/entities/errors';
import { ILogRepository } from '@core/interface_adapters/adapters';
import { IInvokeRepository } from '@core/interface_adapters/adapters/invokeRepository/iInvokeRepository';
import { Lambda } from 'aws-sdk';

export interface IInvoke {
  resource?: string;
  body: string;
  httpMethod?: HttpMethod;
  headers?: { [name: string]: string };
  pathParameters?: { [name: string]: string } | null;
  queryStringParameters?: { [name: string]: string } | null;
}

export type InvocationType = 'Event' | 'RequestResponse' | 'DryRun' | string;
export class InvokeRepository implements IInvokeRepository {
  constructor(private readonly logger: ILogRepository) {}
  async invokeEvent(functionName: string, payload: IInvoke): Promise<IResponse> {
    this.logger.debug({ method: 'InvokeRepository.invokeEvent', data: { body: { functionName, payload } } });
    const lambda = new Lambda();
    try {
      const params = {
        FunctionName: functionName,
        InvocationType: 'Event',
        Payload: JSON.stringify(payload),
      };
      const result = await lambda.invoke(params).promise();

      this.logger.debug({ message: 'invokeEventResponse', data: { body: result } });

      const response: IResponse = {
        statusCode: result.StatusCode,
        body: String(result.Payload),
      };

      return response;
    } catch (error) {
      this.logger.error({ method: 'InvokeRepository.invokeEvent Error', data: { error } });
      throw new ServerError(`Error invoking invokeEvent ${error}`, CoreErrorCodes.UNKNOWN);
    }
  }

  async invokeResponse(functionName: string, payload: IInvoke): Promise<IResponse> {
    this.logger.debug({ method: 'InvokeRepository.invokeResponse', data: { body: { functionName, payload } } });
    const lambda = new Lambda();
    try {
      const params = {
        FunctionName: functionName,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(payload),
      };

      const result = await lambda.invoke(params).promise();

      this.logger.debug({ message: 'invokeResponse', data: { body: result } });

      return JSON.parse(`${String(result.Payload)}`);
    } catch (error) {
      this.logger.error({ method: 'InvokeRepository.invokeResponse Error', data: { error } });
      throw new ServerError(`Error invoking invokeResponse ${error}`, CoreErrorCodes.UNKNOWN);
    }
  }
}
