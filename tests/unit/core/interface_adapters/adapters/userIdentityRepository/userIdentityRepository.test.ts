import { UserIdentityRepository } from '@core/interface_adapters/adapters/userIdentityRepository/userIdentityRepository';
import { CreateUserRequest } from '@lib/enterprise_business_rules/entities/requests/agents/createUserRequest';
import { loggerRepositoryStub } from '@tests/stubs/servicesStubs';
import { userAgentStub, userStub } from '@tests/stubs/users/userStubs';

describe('UserIdentity Repository', () => {
  let userIdentityRepository: UserIdentityRepository;
  // let dbRepositoryMock: IDbRepository;

  beforeEach(() => {
    // dbRepositoryMock = new mockDbRepository();
    userIdentityRepository = new UserIdentityRepository(loggerRepositoryStub);
    // mockAWSCognito.mockReset();
  });

  it('should create user in cognito when everything is fine', async () => {
    const agent = await userIdentityRepository.createCognitoUser(new CreateUserRequest(userStub));
    expect(agent).toMatchObject({
      email: userAgentStub.email,
      firstName: userAgentStub.firstName,
      lastName: userAgentStub.lastName,
      phone: userAgentStub.phone,
    });
  });
});
