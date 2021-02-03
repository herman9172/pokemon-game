import { ISendMessageResult } from '@core/enterprise_business_rules/api_contract/iSendMessageResult';
import { CoreErrorCodes } from '@core/enterprise_business_rules/constants';
import { BaseError, ServerError } from '@core/enterprise_business_rules/entities/errors';
import {
  IAuthenticationRepository,
  ICacheRepository,
  IDbRepository,
  IEmailRepository,
  ILogRepository,
  IRequestErrorHandler,
  IRequestRepository,
  ISecretsRepository,
  ISqsRepository,
  IUserIdentityRepository,
} from '@core/interface_adapters/adapters';
import { IInvokeRepository } from '@core/interface_adapters/adapters/invokeRepository/iInvokeRepository';
import { IServices } from '@lib/framework_drivers/config/app';
import { IMerchantsRepository } from '@lib/interface_adapters/storage';
import { ISuperappRepository } from '@lib/interface_adapters/storage/superapp_repository/iSuperappRepository';

export const loggerRepositoryStub: ILogRepository = {
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

export const authenticationRepositoryStub: IAuthenticationRepository = {
  getAuthenticationTokens: jest.fn(),
};

export const userIdentityRepository: IUserIdentityRepository = {
  createCognitoUser: jest.fn(),
  deleteCognitoUser: jest.fn(),
  toggleEnableCognitoUser: jest.fn(),
  updateUserAttribute: jest.fn(),
};

export const secretManagerRepositoryStub: ISecretsRepository = {
  getSecret: async (secretName: string): Promise<string> => JSON.stringify({ secret: secretName }),
};

export const dbRepositoryStub: IDbRepository = {
  close: (): Promise<boolean> => Promise.resolve(true),
  query: (): Promise<any> => Promise.resolve(),
};

export const requestRepositoryStub: IRequestRepository = {
  doPost: jest.fn(),
  doGet: jest.fn(),
  doDelete: jest.fn(),
  doPut: jest.fn(),
};

export const cacheRepositoryRedisStub: ICacheRepository = {
  set: jest.fn(),
  get: jest.fn(),
  hGetAll: jest.fn(),
  remove: jest.fn(),
  hmSet: jest.fn(),
  exists: jest.fn(),
  setEx: jest.fn(),
  expire: jest.fn(),
  geoadd: jest.fn(),
  getNearestPoint: jest.fn(),
};

export const requestErrorHandlerStub: IRequestErrorHandler = {
  handleError: (): BaseError => new ServerError('', CoreErrorCodes.UNKNOWN),
};

export const sqsRepositoryStub: ISqsRepository = {
  sendMessage: (): Promise<ISendMessageResult> =>
    Promise.resolve({
      MD5OfMessageBody: '1d16eef89c3f3117e11d6cbd36b1cd6a',
      MessageId: '24104d71-58b7-47cf-8e50-09871a1b0123',
    }),
  deleteMessage: (): Promise<void> => Promise.resolve(),
  getQueueUrl: (): Promise<string> => Promise.resolve('SQS_NAME'),
  changeVisibilityTimeout: () => Promise.resolve(),
};

export const invokeRepositoryStub: IInvokeRepository = {
  invokeEvent: jest.fn(),
  invokeResponse: jest.fn(),
};

export const emailRepositoryStub: IEmailRepository = {
  sendEmail: jest.fn(),
  sendEmailFromTemplate: jest.fn(),
};

export const merchantRepositoryStub: IMerchantsRepository = {
  getMerchant: jest.fn(),
  addMerchant: jest.fn(),
  getStores: jest.fn(),
  getPointOfSales: jest.fn(),
  getStaticQrCode: jest.fn(),
};

export const superappRepositoryStub: ISuperappRepository = {
  searchUsers: jest.fn(),
};

export const servicesStub: IServices = {
  logRepository: loggerRepositoryStub,
  secretsRepository: secretManagerRepositoryStub,
  requestErrorHandler: requestErrorHandlerStub,
  dbBackofficeRepository: dbRepositoryStub,
  requestRepository: requestRepositoryStub,
  // cacheRepositoryRedis: cacheRepositoryRedisStub,
  emailRepository: emailRepositoryStub,
  invokeRepository: invokeRepositoryStub,
  sqsRepository: sqsRepositoryStub,
  merchantRepository: merchantRepositoryStub,
  superappRepository: superappRepositoryStub,
  agentsRepository: agentsRepositoryStub,
  userIdentityRepository,
  // authenticationRepository: authenticationRepositoryStub,
};
