import { SecretsManager } from 'aws-sdk';

export interface ISecretsRepository {
  getSecret(secretKey: string): Promise<SecretsManager.SecretBinaryType | SecretsManager.SecretStringType>;
}
