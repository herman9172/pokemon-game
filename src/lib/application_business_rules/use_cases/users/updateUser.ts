// istanbul ignore file

import { ILogRepository, IUserIdentityRepository } from '@core/interface_adapters/adapters';
import { IUser } from '@lib/enterprise_business_rules/api_contract/users/iUser';
import { UpdateUserRequest } from '@lib/enterprise_business_rules/entities/requests';
import { IUsersRepository } from '@lib/interface_adapters/storage';

export class UpdateUser {
  constructor(
    private readonly userIdentityRepository: IUserIdentityRepository,
    private readonly userRepository: IUsersRepository,
    private readonly logger: ILogRepository,
  ) {}

  async updateUser(updateUserRequest: UpdateUserRequest): Promise<IUser> {
    this.logger.debug({
      method: 'UpdateUser.updateUser',
      data: { updateUserRequest },
    });

    const user = updateUserRequest.toUser();

    const updatedUser = await this.updateUserInLocalDb(user);
    await this.updateUserInCognito(updatedUser);

    return updatedUser;
  }

  private async updateUserInCognito(user: IUser): Promise<void> {
    await this.userIdentityRepository.updateUserAttribute(user);

    if (user.enabled !== undefined) {
      await this.userIdentityRepository.toggleEnableCognitoUser(user);
    }
  }

  private async updateUserInLocalDb(user: IUser): Promise<IUser> {
    return this.userRepository.upsertUser(user);
  }
}
