import { IAuthenticationRequest } from '@core/interface_adapters/adapters';
export interface IAuthenticationRepository {
  getAuthenticationTokens(authenticationRequest: IAuthenticationRequest): Promise <any>;
}
