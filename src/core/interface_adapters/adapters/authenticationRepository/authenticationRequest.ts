import { IAuthenticationRequest } from '@core/interface_adapters/adapters';
export class AuthenticationRequest implements IAuthenticationRequest {
  authenticationUrl: string;
  clientId?: string;
  authorizationKey?: string;
  grantType?: string;
  scope?: string;
}
