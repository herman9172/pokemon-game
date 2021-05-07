import { GetPokemonsRequest } from '@lib/enterprise_business_rules/entities/requests';

export interface IPokemonsRepository {
  getPokemons(getPokemonsRequest: iGetPokemonsRequest): Promise<any>;
}
