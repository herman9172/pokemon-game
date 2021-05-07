// istanbul ignore file

const tests = {
  '/users': {
    POST: UsersController.createUser,
  },
};

export class ApiRoutes {
  static setupRoutes(): any {
    return {
      ...tests,
    };
  }
}
