export interface IChangeSQSVisibilityTimeoutRequest {
  /**
   * The URL of the Amazon SQS queue whose message's visibility is changed. Queue URLs and names are case-sensitive.
   */
  QueueUrl: string;
  /**
   * The receipt handle associated with the message whose visibility timeout is changed.
   * This parameter is returned by the  ReceiveMessage  action.
   */
  ReceiptHandle: string;
  /**
   * The new value for the message's visibility timeout (in seconds). Values values: 0 to 43200. Maximum: 12 hours.
   */
  VisibilityTimeout: number;
}
