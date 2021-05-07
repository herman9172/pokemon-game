import { ILog, ILogRepository, IRequestRepository } from '@core/interface_adapters/adapters';
import { GetPokemons } from '@lib/application_business_rules/use_cases/pokemons/getPokemons';
import { GetPokemonsRequest } from '@lib/enterprise_business_rules/entities/requests';
import { PokemonsRepository } from '@lib/interface_adapters/storage/pokemons_repository/pokemonsRepository';

const requestRepositoryStub: IRequestRepository = {
  doPost: jest.fn(),
  doGet: jest.fn(),
  doDelete: jest.fn(),
  doPut: jest.fn(),
};

const loggerRepositoryStub: ILogRepository = {
  info: (_logEntity: ILog) => {},
  debug: (_logEntity: ILog) => {},
  warn: (_logEntity: ILog) => {},
  error: (_logEntity: ILog) => {},
};

describe('it should test getPokemons use case', () => {
  let mockServices;
  beforeEach(() => {
    mockServices = {
      pokemonsRepository: new PokemonsRepository(requestRepositoryStub, loggerRepositoryStub),
    };
  });

  afterEach(() => {
    // clean up our mock services to avoid issues
    mockServices = null;
  });

  it('it should get a list of 3 pokemons with parameters limit = 3', async () => {
    const requestStub = {
      limit: '3',
    };
    const responseStub = JSON.parse(
      '{"result":{"count":1118,"next":"https://pokeapi.co/api/v2/pokemon?offset=3&limit=3","previous":null,"results":[{"name":"bulbasaur","url":"https://pokeapi.co/api/v2/pokemon/1/"},{"name":"ivysaur","url":"https://pokeapi.co/api/v2/pokemon/2/"},{"name":"venusaur","url":"https://pokeapi.co/api/v2/pokemon/3/"}]}}',
    );

    spyOn(requestRepositoryStub, 'doGet').and.returnValue(responseStub);

    const getPokemonsRequest = new GetPokemonsRequest(requestStub);

    const getPokemons = new GetPokemons(mockServices.pokemonsRepository, loggerRepositoryStub);

    const response = await getPokemons.getPokemons(getPokemonsRequest);
    expect(response).toBe(responseStub);
    expect(requestRepositoryStub.doGet).toBeCalled();
  });

  it('it should get a list of 10 pokemons with parameters limit = 10 and offset = 2', async () => {
    const requestStub = {
      limit: '10',
      offset: '2',
    };
    const responseStub = JSON.parse(
      '{"result":{"count":1118,"next":"https://pokeapi.co/api/v2/pokemon?offset=10&limit=10","previous":null,"results":[{"name":"bulbasaur","url":"https://pokeapi.co/api/v2/pokemon/1/"},{"name":"ivysaur","url":"https://pokeapi.co/api/v2/pokemon/2/"},{"name":"venusaur","url":"https://pokeapi.co/api/v2/pokemon/3/"},{"name":"charmander","url":"https://pokeapi.co/api/v2/pokemon/4/"},{"name":"charmeleon","url":"https://pokeapi.co/api/v2/pokemon/5/"},{"name":"charizard","url":"https://pokeapi.co/api/v2/pokemon/6/"},{"name":"squirtle","url":"https://pokeapi.co/api/v2/pokemon/7/"},{"name":"wartortle","url":"https://pokeapi.co/api/v2/pokemon/8/"},{"name":"blastoise","url":"https://pokeapi.co/api/v2/pokemon/9/"},{"name":"caterpie","url":"https://pokeapi.co/api/v2/pokemon/10/"}]}}',
    );

    spyOn(requestRepositoryStub, 'doGet').and.returnValue(responseStub);

    const getPokemonsRequest = new GetPokemonsRequest(requestStub);

    const getPokemons = new GetPokemons(mockServices.pokemonsRepository, loggerRepositoryStub);

    const response = await getPokemons.getPokemons(getPokemonsRequest);
    expect(response).toBe(responseStub);
    expect(requestRepositoryStub.doGet).toBeCalled();
  });

  it('it should try to get a list of pokemons with parameters limit = 10 and offset = 2 and API throws an error', async () => {
    const requestStub = {
      limit: '10',
      offset: '2',
    };

    const errorMessage = 'api error';
    jest.spyOn(mockServices.pokemonsRepository, 'getPokemons').mockImplementation(() => {
      throw new Error(errorMessage);
    });

    const getPokemonsRequest = new GetPokemonsRequest(requestStub);

    const getPokemons = new GetPokemons(mockServices.pokemonsRepository, loggerRepositoryStub);

    try {
      await getPokemons.getPokemons(getPokemonsRequest);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe(errorMessage);
    }
  });
});
