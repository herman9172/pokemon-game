import { IRequest } from '@core/enterprise_business_rules/api_contract';
import { GetPokemons } from '@lib/application_business_rules/use_cases/pokemons/getPokemons';
import { GetPokemonsRequest } from '@lib/enterprise_business_rules/entities/requests/pokemons/getPokemonsRequest';
import { IServices } from '@lib/framework_drivers/config/app';

export class PokemonsController {
  static async getPokemons(request: IRequest, services: IServices): Promise<any> {
    const { limit, offset } = request.queryStringParams;
    const getPokemonsRequest = new GetPokemonsRequest({ limit, offset });

    await services.requestValidator.validate(getPokemonsRequest);

    const getPokemons = new GetPokemons(services.pokemonsRepository, services.logRepository);

    return getPokemons.getPokemons(getPokemonsRequest);
  } // end of getPokemons
}
