import { ILog, ILogRepository, IRequestRepository } from '@core/interface_adapters/adapters';
import { RequestValidator } from '@core/interface_adapters/adapters/request_validator/requestValidator';
import { PokemonsController } from '@lib/interface_adapters/controllers/pokemonsController';
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

describe.only('it should test pokemonsController', () => {
  let mockServices;
  beforeEach(() => {
    mockServices = {
      logRepository: loggerRepositoryStub,
      pokemonsRepository: new PokemonsRepository(requestRepositoryStub, loggerRepositoryStub),
      requestValidator: new RequestValidator(),
    };
  });

  afterEach(() => {
    // clean up our mock services to avoid issues
    mockServices = null;
  });

  it('should test pokemonsController with parameters limit 2', async () => {
    const request = {
      queryStringParams: {
        limit: '2',
      },
    };

    const responseStub = JSON.parse(
      '{"result":{"count":1118,"next":"https://pokeapi.co/api/v2/pokemon?offset=3&limit=3","previous":null,"results":[{"name":"bulbasaur","url":"https://pokeapi.co/api/v2/pokemon/1/"},{"name":"ivysaur","url":"https://pokeapi.co/api/v2/pokemon/2/"},{"name":"venusaur","url":"https://pokeapi.co/api/v2/pokemon/3/"}]}}',
    );

    spyOn(requestRepositoryStub, 'doGet').and.returnValue(responseStub);

    const result = await PokemonsController.getPokemons(request, mockServices);
    expect(result).toBe(responseStub);
    expect(requestRepositoryStub.doGet).toBeCalled();
  });

  it('should test pokemonsController with parameters limit 2 and offset 2', async () => {
    const request = {
      queryStringParams: {
        limit: '2',
      },
    };

    const responseStub = JSON.parse(
      '{"result":{"count":1118,"next":"https://pokeapi.co/api/v2/pokemon?offset=4&limit=2","previous":"https://pokeapi.co/api/v2/pokemon?offset=0&limit=2","results":[{"name":"venusaur","url":"https://pokeapi.co/api/v2/pokemon/3/"},{"name":"charmander","url":"https://pokeapi.co/api/v2/pokemon/4/"}]}}',
    );

    spyOn(requestRepositoryStub, 'doGet').and.returnValue(responseStub);

    const result = await PokemonsController.getPokemons(request, mockServices);
    expect(result).toBe(responseStub);
    expect(requestRepositoryStub.doGet).toBeCalled();
  });

  it('should test pokemonsController without parameters and throws Error with http status code 400', async () => {
    const request = {
      queryStringParams: {},
    };

    try {
      await PokemonsController.getPokemons(request, mockServices);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.httpStatus).toBe(400);
    }
  });
});
