export interface ISendMessageRequest {
  QueueUrl: string;
  MessageBody: string;
  DelaySeconds?: number;
  MessageDeduplicationId?: string;
  MessageGroupId?: string;
}
