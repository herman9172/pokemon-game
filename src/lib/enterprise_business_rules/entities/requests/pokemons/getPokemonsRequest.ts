import { IGetPokemonsRequest } from '@lib/enterprise_business_rules/api_contract/pokemons/iGetPokemonsRequest';
import { IsString } from 'class-validator';

export class GetPokemonsRequest {
  @IsString()
  protected readonly limit: string;

  @IsString()
  protected readonly offset: string;

  constructor(request: IGetPokemonsRequest) {
    this.limit = request.limit;
    this.offset = request.offset;
  }

  serialize(): IGetPokemonsRequest {
    return {
      limit: this.limit,
      offset: this.offset,
    };
  }
}
