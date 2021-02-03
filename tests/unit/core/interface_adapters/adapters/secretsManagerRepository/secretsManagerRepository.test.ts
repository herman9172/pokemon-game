import { SecretsManagerRepository } from '@core/interface_adapters/adapters';
import { awsApiErrorStub } from '@tests/stubs/requestStubs';
import { loggerRepositoryStub } from '@tests/stubs/servicesStubs';
import { SecretsManager } from 'aws-sdk';

const mockAWSSecretManager = jest.fn();

jest.mock('aws-sdk', () => ({
  SecretsManager: jest.fn(() => ({
    getSecretValue: mockAWSSecretManager,
  })),
}));

const cognitoAdminSecretStub: SecretsManager.GetSecretValueResponse = {
  SecretString: `{
    'accessKeyId': 'accessKeyId',
    'secretAccessKey': 'secretAccessKey',
    'username': ' cognito-admin'
  }`,
};

describe('SecretManagerRepository', () => {
  let secretManagerRepository: SecretsManagerRepository;

  beforeEach(() => {
    secretManagerRepository = new SecretsManagerRepository(loggerRepositoryStub);
    mockAWSSecretManager.mockReset();
  });

  it('should return secret', async () => {
    mockAWSSecretManager.mockImplementation((_params) => ({
      async promise(): Promise<SecretsManager.GetSecretValueResponse> {
        return Promise.resolve(cognitoAdminSecretStub);
      },
    }));

    const result = await secretManagerRepository.getSecret('cognito-admin');
    expect(result).toEqual(cognitoAdminSecretStub.SecretString);
  });

  it('should return a falsy value when an empty SecretString is received', async () => {
    mockAWSSecretManager.mockImplementation((_params) => ({
      async promise(): Promise<SecretsManager.GetSecretValueResponse> {
        return Promise.resolve({ SecretString: '' });
      },
    }));

    const result = await secretManagerRepository.getSecret('cognito-admin');
    expect(result).toBeFalsy();
  });

  it('should throw error', async () => {
    expect.hasAssertions();

    mockAWSSecretManager.mockImplementation((_params) => ({
      async promise(): Promise<SecretsManager.GetSecretValueResponse> {
        return Promise.reject(awsApiErrorStub);
      },
    }));

    try {
      await secretManagerRepository.getSecret('cognito-admin');
    } catch (error) {
      expect(error.message).toEqual(awsApiErrorStub.message);
    }
  });
});
