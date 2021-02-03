import { IAuthenticationTokens } from '@core/interface_adapters/adapters';

export class AuthenticationTokens implements IAuthenticationTokens {
  idToken?: string;
  accessToken?: string;
}
