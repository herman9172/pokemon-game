// istanbul ignore file

import { ILogRepository } from '@core/interface_adapters/adapters';
import { generate, Options } from 'generate-password';

export class GeneratePassword {
  constructor(private readonly logger: ILogRepository) {}

  generateStrongPassword(options?: Options): string {
    this.logger.debug({ method: 'GeneratePassword.generateStrongPassword' });
    const defaultOptions = {
      length: 10,
      numbers: true,
    };

    return generate(options || defaultOptions);
  }
}
