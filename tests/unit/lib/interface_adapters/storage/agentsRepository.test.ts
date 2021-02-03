import { IUsersRepository } from '@lib/interface_adapters/storage/users_repository/iUsersRepository';
import { UsersRepository } from '@lib/interface_adapters/storage/users_repository/usersRepository';
import { dbRepositoryStub, loggerRepositoryStub, userIdentityRepository } from '@tests/stubs/servicesStubs';

describe('Create Agent Use Cases', () => {
  const useCase: IUsersRepository = new UsersRepository(dbRepositoryStub, loggerRepositoryStub);

  // beforeEach(() => {
  // });

  const agent = new UserAgent({
    id: 1,
    sub: 'R',
    firstName: 'Roy',
    lastName: 'Fallas',
    secondLastName: 'Mora',
    email: 'roy.fallas5335@gmail.com',
    phone: '84032531',
    password: 'Test1234',
  });

  it('should create a new agent in Cognito', async () => {
    const agentIdentityRepositoryStubSpy = spyOn(userIdentityRepository, 'createCognitoUser');

    await useCase.upsertUser(agent);

    expect(agentIdentityRepositoryStubSpy).toHaveBeenCalledTimes(1);
  });
});
