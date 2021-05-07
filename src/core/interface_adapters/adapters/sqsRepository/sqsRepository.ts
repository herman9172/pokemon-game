// istanbul ignore file

import { env } from '@config/env';
import { IChangeSQSVisibilityTimeoutRequest } from '@core/enterprise_business_rules/api_contract/iChangeSQSVisibilityTimeoutRequest';
import { IDeleteSQSMessageRequest } from '@core/enterprise_business_rules/api_contract/iDeleteSQSMessageRequest';
import { ISendMessageRequest } from '@core/enterprise_business_rules/api_contract/iSendMessageRequest';
import { ISendMessageResult } from '@core/enterprise_business_rules/api_contract/iSendMessageResult';
import { CoreErrorCodes } from '@core/enterprise_business_rules/constants';
import { ServerError } from '@core/enterprise_business_rules/entities/errors';
import { ILogRepository } from '@core/interface_adapters/adapters';
import { ISqsRepository } from '@core/interface_adapters/adapters/sqsRepository/iSqsRepository';
import { SQS } from 'aws-sdk';

export class SqsRepository implements ISqsRepository {
  constructor(private readonly logger: ILogRepository) {}

  async sendMessage(sendMessageRequest: ISendMessageRequest): Promise<ISendMessageResult> {
    this.logger.debug({ method: 'SqsRepository.sendMessage', data: { sendMessageRequest } });
    const sqs = new SQS({
      region: env.REGION,
    });
    try {
      return await sqs.sendMessage(sendMessageRequest).promise();
    } catch (error) {
      this.logger.error({ method: 'SqsRepository.sendMessage Error', data: { error } });
      throw new ServerError(`An error has ocurred sending the SQS message ${error}`, CoreErrorCodes.SQS_ERROR);
    }
  }

  async deleteMessage(deleteMessageRequest: IDeleteSQSMessageRequest): Promise<void> {
    this.logger.debug({ method: 'SqsRepository.deleteMessage', data: deleteMessageRequest });
    const sqs = new SQS({
      region: env.REGION,
    });
    try {
      await sqs.deleteMessage(deleteMessageRequest).promise();
    } catch (error) {
      this.logger.error({ method: 'SqsRepository.deleteMessage Error', data: { error } });
      throw new ServerError(`An error has occurred deleting the SQS message: ${error}`, CoreErrorCodes.SQS_ERROR);
    }
  }

  async getQueueUrl(queueName: string): Promise<string> {
    this.logger.debug({ method: 'SqsRepository.getQueueUrl', data: queueName });
    const sqs = new SQS({
      region: env.REGION,
    });
    try {
      const queueUrl = await sqs
        .getQueueUrl({
          QueueName: queueName,
        })
        .promise();

      return queueUrl.QueueUrl;
    } catch (error) {
      this.logger.error({ method: 'SqsRepository.getQueueUrl Error', data: { error } });
      throw new ServerError(`An error occurred getting the SQS URL: ${error}`, CoreErrorCodes.SQS_ERROR);
    }
  }

  async changeVisibilityTimeout(changeVisibilityTimeoutRequest: IChangeSQSVisibilityTimeoutRequest): Promise<void> {
    this.logger.debug({ method: 'SqsRepository.changeVisibilityTimeout', data: { changeVisibilityTimeoutRequest } });
    const sqs = new SQS({
      region: env.REGION,
    });
    try {
      await sqs.changeMessageVisibility(changeVisibilityTimeoutRequest).promise();
    } catch (error) {
      this.logger.error({ method: 'SqsRepository.changeVisibilityTimeout Error', data: { error } });
      throw new ServerError(
        `An error occurred changing the visibility timeout of the message: ${error}`,
        CoreErrorCodes.SQS_ERROR,
      );
    }
  }
}
