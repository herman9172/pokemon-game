import { IRequest } from '@core/enterprise_business_rules/api_contract';
import { CreateUser } from '@lib/application_business_rules/use_cases/users/createUser';
import { GetUser } from '@lib/application_business_rules/use_cases/users/getUser';
import { ResendUserTemporaryPassword } from '@lib/application_business_rules/use_cases/users/resendUserTemporaryPassword';
import { UpdateUser } from '@lib/application_business_rules/use_cases/users/updateUser';
import { IUser } from '@lib/enterprise_business_rules/api_contract/users/iUser';
import { CreateUserRequest, UpdateUserRequest } from '@lib/enterprise_business_rules/entities/requests';
import { IServices } from '@lib/framework_drivers/config/app';

export class UsersController {

  static async createUser(request: IRequest, services: IServices): Promise<any> {
    const createUser = new CreateUser(
      services.userIdentityRepository,
      services.usersRepository,
      services.logRepository,
    );
    const createUserRequest = new CreateUserRequest({ ...request.jsonBody });
    await services.requestValidator.validate(createUserRequest);

    return createUser.createUser(createUserRequest);
  } // end of createUser

  static async updateUser(request: IRequest, services: IServices): Promise<any> {
    const updateUser = new UpdateUser(
      services.userIdentityRepository,
      services.usersRepository,
      services.logRepository,
    );
    const updateUserRequest = new UpdateUserRequest({ ...request.jsonBody, email: request.params.email });
    await services.requestValidator.validate(updateUserRequest);

    return updateUser.updateUser(updateUserRequest);
  } // end of updateUser

  static async getUser(request: IRequest, services: IServices): Promise<any> {
    const getUser = new GetUser(
      services.usersRepository,
      services.logRepository,
    );

    const email = request.params.email;

    return getUser.getUser(email);
  } // end of getUser

  static async resendUserTemporaryPassword(request: IRequest, services: IServices): Promise<any> {
    const resendUserTemporaryPassword = new ResendUserTemporaryPassword(
      services.userIdentityRepository,
      services.usersRepository,
      services.logRepository,
    );

    const email = request.params.email;
   // const createUserRequest = new CreateUserRequest({ ...request.jsonBody, email });

    return resendUserTemporaryPassword.resendUserTemporaryPassword(email);
  } // end of getUser
}
