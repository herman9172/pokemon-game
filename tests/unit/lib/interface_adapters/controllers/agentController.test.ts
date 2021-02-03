import { IRequest } from '@core/enterprise_business_rules/api_contract';
import { CreateUser } from '@lib/application_business_rules/use_cases/users/createUser';
import { UsersController } from '@lib/interface_adapters/controllers/usersController';
import { servicesStub } from '@tests/stubs/servicesStubs';

describe('Agent Controller', () => {
  describe('createCognitoUser', () => {
    const agent =
      '{"id": 1, "sub": "R", "firstName": "Roy", "lastName": "Fallas", "secondLastName": "Mora", "email": "roy.fallas5335@gmail.com", "phone": "84032531", "password": "Test1234"}';

    const requestStub: IRequest = {
      body: agent,
    };

    it('should call the use case', async () => {
      const useCaseSpy = spyOn(CreateUser.prototype, 'createUser');
      await UsersController.createUser(requestStub, servicesStub);
      expect(useCaseSpy).toHaveBeenCalledTimes(1);
    });
  });
});
