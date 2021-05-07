import { IGetPokemonsRequest } from '@lib/enterprise_business_rules/api_contract/pokemons/iGetPokemonsRequest';
import { IsNumberString, IsDefined, IsOptional } from 'class-validator';

export class GetPokemonsRequest {
  @IsDefined()
  @IsNumberString()
  protected readonly limit: string;

  @IsOptional()
  @IsNumberString()
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
