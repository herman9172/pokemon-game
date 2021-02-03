export interface IAuthenticationRequest {
  authenticationUrl: string;
  clientId?: string;
  secretKey?: string;
  grantType?: string;
  scope?: string;
  contentType?: string;
  authorizationKey?: string;
}
