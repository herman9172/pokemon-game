export interface IDeleteSQSMessageRequest {
  /**
   * The URL of the Amazon SQS queue from which messages are deleted. Queue URLs and names are case-sensitive.
   */
  QueueUrl: string;
  /**
   * The receipt handle associated with the message to delete.
   */
  ReceiptHandle: string;
}
