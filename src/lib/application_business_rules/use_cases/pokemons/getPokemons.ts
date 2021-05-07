import { BaseError } from '@core/enterprise_business_rules/entities/errors';
import { ILogRepository } from '@core/interface_adapters/adapters';
import { GetPokemonsRequest } from '@lib/enterprise_business_rules/entities/requests';
import { IPokemonsRepository } from '@lib/interface_adapters/storage';

export class GetPokemons {
  constructor(private readonly pokemonsRepository: IPokemonsRepository, private readonly logger: ILogRepository) {}

  async getPokemons(getPokemonsRequest: GetPokemonsRequest): Promise<any> {
    this.logger.info({
      method: 'GetPokemons.getPokemons',
      data: { getPokemonsRequest },
    });

    try {
      return this.pokemonsRepository.getPokemons(getPokemonsRequest);
    } catch (err) {
      this.logger.error({
        method: 'GetPokemons.getPokemons',
        message: err,
        data: { error: BaseError.serialize(err) },
      });

      throw err;
    }
  } // end of getPokemons
}
