import { IChangeSQSVisibilityTimeoutRequest } from '@core/enterprise_business_rules/api_contract/iChangeSQSVisibilityTimeoutRequest';
import { IDeleteSQSMessageRequest } from '@core/enterprise_business_rules/api_contract/iDeleteSQSMessageRequest';
import { ISendMessageRequest } from '@core/enterprise_business_rules/api_contract/iSendMessageRequest';
import { ISendMessageResult } from '@core/enterprise_business_rules/api_contract/iSendMessageResult';

export interface ISqsRepository {
  sendMessage(sendMessageRequest: ISendMessageRequest): Promise<ISendMessageResult>;
  deleteMessage(deleteMessageRequest: IDeleteSQSMessageRequest): Promise<void>;
  getQueueUrl(queueName: string): Promise<string>;
  changeVisibilityTimeout(changeVisibilityTimeoutRequest: IChangeSQSVisibilityTimeoutRequest): Promise<void>;
}
