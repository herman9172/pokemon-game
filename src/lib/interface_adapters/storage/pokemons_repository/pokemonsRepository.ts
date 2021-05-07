import { IRequestRepository } from '@core/interface_adapters/adapters';
import { ILogRepository } from '@core/interface_adapters/adapters/logRepository/iLogRepository';
import { GetPokemonsRequest } from '@lib/enterprise_business_rules/entities/requests';
import { IPokemonsRepository } from '@lib/interface_adapters/storage/pokemons_repository/iPokemonsRepository';

export class PokemonsRepository implements IPokemonsRepository {
  private readonly serviceUrl: string = 'https://pokeapi.co/api/v2/';
  constructor(private readonly requestRepository: IRequestRepository, private readonly logger: ILogRepository) {}

  async getPokemons(getPokemonsRequest: GetPokemonsRequest): Promise<any> {
    const { limit, offset } = getPokemonsRequest.serialize();
    this.logger.debug({
      method: 'PokemonsRepository.getPokemons',
      data: {
        limit,
        offset,
      },
    });

    return this.requestRepository.doGet(`${this.serviceUrl}pokemon`, {
      limit,
      offset,
    });
  } // end of getPokemons
}
