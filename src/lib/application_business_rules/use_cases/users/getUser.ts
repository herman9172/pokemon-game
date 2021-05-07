// istanbul ignore file

import { ILogRepository } from '@core/interface_adapters/adapters';
import { IUser } from '@lib/enterprise_business_rules/api_contract/users/iUser';
import { IUsersRepository } from '@lib/interface_adapters/storage';

export class GetUser {
  constructor(private readonly usersRepository: IUsersRepository, private readonly logger: ILogRepository) {}

  async getUser(email: string): Promise<IUser> {
    this.logger.debug({
      method: 'GetUser.getUser',
      data: { updateUserRequest: email },
    });
    const user = this.usersRepository.getUser(email);

    return user;
  }
}
