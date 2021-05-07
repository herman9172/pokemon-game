// istanbul ignore file
import { PokemonsController } from '@lib/interface_adapters/controllers/pokemonsController';

const routes = {
  '/pokemons': {
    GET: PokemonsController.getPokemons,
  },
};

export class ApiRoutes {
  static setupRoutes(): any {
    return {
      ...routes,
    };
  }
}
