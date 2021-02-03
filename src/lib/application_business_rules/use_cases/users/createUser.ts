import { GeneratePassword } from '@core/application_business_rules/use_cases/generatePassword';
import { BaseError } from '@core/enterprise_business_rules/entities/errors';
import { ILogRepository, IUserIdentityRepository } from '@core/interface_adapters/adapters';
import { CreateUserRequest } from '@lib/enterprise_business_rules/entities/requests';
import { IUsersRepository } from '@lib/interface_adapters/storage';

export class CreateUser {
  constructor(
    private readonly userIdentityRepository: IUserIdentityRepository,
    private readonly usersRepository: IUsersRepository,
    private readonly logger: ILogRepository,
  ) {}

  async createUser(createUserRequest: CreateUserRequest): Promise<any> {
    this.logger.debug({
      method: 'CreateUser.createUser',
      data: { createUserRequest },
    });

    const user = createUserRequest.toUser();
    user.password = this.createTemporaryPassword();

    const createdCognitoUser = await this.userIdentityRepository.createCognitoUser(user);

    try {
      return await this.usersRepository.upsertUser(createdCognitoUser);
    } catch (err) {
      this.logger.error({
        method: 'CreateUser.createUser',
        message: err,
        data: { error: BaseError.serialize(err) },
      });
      await this.userIdentityRepository.deleteCognitoUser(createdCognitoUser);

      throw err;
    }
  } // end of CreateUser

  /**
   * Gets the user with a new generated temporary password
   *
   * Agents will have temporary passwords during the first sign-in
   * This password will be sent to the user by Email
   */
  private createTemporaryPassword(): string {
    return new GeneratePassword(this.logger).generateStrongPassword({
      length: 10,
      numbers: true,
      uppercase: true,
      lowercase: true,
      strict: true,
    });
  } // end of createTemporaryPassword
}
