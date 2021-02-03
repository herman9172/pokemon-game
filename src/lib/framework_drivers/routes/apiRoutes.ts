// istanbul ignore file
import { UsersController } from '@lib/interface_adapters/controllers/usersController';

const tests = {
  '/users': {
    POST: UsersController.createUser,
  },

  '/users/{email}': {
    PUT: UsersController.updateUser,
    GET: UsersController.getUser,
  },

  '/users/{email}/resend': {
    POST: UsersController.resendUserTemporaryPassword,
  },
};

export class ApiRoutes {
  static setupRoutes(): any {
    return {
      ...tests,
    };
  }
}
