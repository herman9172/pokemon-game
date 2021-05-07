// istanbul ignore file

import { BaseError } from '@core/enterprise_business_rules/entities/errors';
import { ILogRepository, IUserIdentityRepository } from '@core/interface_adapters/adapters';
import { IUser } from '@lib/enterprise_business_rules/api_contract/users/iUser';
import { IUsersRepository } from '@lib/interface_adapters/storage';

export class ResendUserTemporaryPassword {
  constructor(
    private readonly userIdentityRepository: IUserIdentityRepository,
    private readonly usersRepository: IUsersRepository,
    private readonly logger: ILogRepository,
  ) {}

  async resendUserTemporaryPassword(email: string): Promise<IUser> {
    this.logger.debug({
      method: 'ResendUserTemporaryPassword.resendUserTemporaryPassword',
      data: { email },
    });
    try {
      const createdCognitoUser = await this.usersRepository.getUser(email);

      return await this.userIdentityRepository.resendUserTemporaryPassword(createdCognitoUser);
    } catch (err) {
      this.logger.error({
        method: 'ResendUserTemporaryPassword.resendUserTemporaryPassword',
        message: err,
        data: { error: BaseError.serialize(err) },
      });
      throw err;
    }
  }
}
