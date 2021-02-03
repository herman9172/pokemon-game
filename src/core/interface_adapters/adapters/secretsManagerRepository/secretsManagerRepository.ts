import { CoreErrorCodes } from '@core/enterprise_business_rules/constants';
import { ServerError } from '@core/enterprise_business_rules/entities/errors';
import { ILogRepository, ISecretsRepository } from '@core/interface_adapters/adapters';
import { SecretsManager } from 'aws-sdk';

export class SecretsManagerRepository implements ISecretsRepository {
  constructor(private readonly logger: ILogRepository) {}

  async getSecret(secretKey: string): Promise<SecretsManager.SecretBinaryType | SecretsManager.SecretStringType> {
    const region = process.env.REGION;
    const client = new SecretsManager({
      endpoint: `https://secretsmanager.${region}.amazonaws.com`,
      region,
    });

    try {
      const response: SecretsManager.GetSecretValueResponse = await client
        .getSecretValue({ SecretId: secretKey })
        .promise();

      if (response.SecretString !== '') {
        return response.SecretString;
      }

      return response.SecretBinary;
    } catch (error) {
      this.logger.error({ message: `An error occurred getting the secret key ${secretKey}`, data: { error } });
      throw new ServerError(error.message, CoreErrorCodes.SECRET_MANAGER_ERROR_WITH_KEY);
    }
  }
}
