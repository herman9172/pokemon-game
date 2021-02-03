import { CreateUser } from '@lib/application_business_rules/use_cases/users/createUser';
import { UserAgent } from '@lib/enterprise_business_rules/entities/userAgent';
import { agentsRepositoryStub, loggerRepositoryStub } from '@tests/stubs/servicesStubs';

describe('Create Agent Uses Case', () => {
  let useCase: CreateUser;

  beforeEach(() => {
    useCase = new CreateUser(agentsRepositoryStub, loggerRepositoryStub);
  });

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

  it('should create an Agent', async () => {
    const agentsRepositoryStubSpy = spyOn(agentsRepositoryStub, 'createCognitoUser');
    await useCase.createUser(agent);

    expect(agentsRepositoryStubSpy).toHaveBeenCalledTimes(1);
  });
});
