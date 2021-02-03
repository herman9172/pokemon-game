// istanbul ignore file
// TODO: Enable coverage when this adapter is implemented

import { SecretsManagerRepository } from '@core/interface_adapters/adapters';
import { SecretsManager } from 'aws-sdk';

export class LocalSecretsManagerRepository extends SecretsManagerRepository {
  localSecrets = {
    'local/db/app': {
      host: 'env.DB_HOST,', // TODO: How to access custom local envs?
    },
  };

  async getSecret(secretKey: string): Promise<SecretsManager.SecretBinaryType | SecretsManager.SecretStringType> {
    const localKey = localStorage[secretKey];

    if (localKey) {
      return JSON.stringify(localKey);
    }

    return super.getSecret(secretKey);
  }
}
