// istanbul ignore file

import {
  AuthenticationTokens,
  IAuthenticationRepository,
  IAuthenticationRequest,
  IAuthenticationTokens,
  ICacheRepository,
  ILogRepository,
  IRequestRepository,
} from '@core/interface_adapters/adapters';
const OMNIPAY_BEARER_TOKEN = 'omnipayBearerToken';

export class AuthenticationRepository implements IAuthenticationRepository {
  constructor(
    private readonly requestRepository: IRequestRepository,
    private readonly logRepository: ILogRepository,
    private readonly _cache: ICacheRepository,
  ) {}

  async getAuthenticationTokens(authenticationRequest: IAuthenticationRequest): Promise<AuthenticationTokens> {
    this.logRepository.debug({ method: 'AuthenticateRepository.getAuthenticationTokens' });
    let authenticationToken: IAuthenticationTokens = new AuthenticationTokens();
    let expiresIn: number;
    if ((await this._cache.get(OMNIPAY_BEARER_TOKEN)) !== null) {
      authenticationToken = JSON.parse(await this._cache.get(OMNIPAY_BEARER_TOKEN));
    }
    if (!authenticationToken.accessToken) {
      const base64Credentials = Buffer.from(
        `${authenticationRequest.clientId}:${authenticationRequest.secretKey}`,
      ).toString('base64');
      const response = await this.requestRepository.doPost(
        authenticationRequest.authenticationUrl,
        `grant_type=client_credentials&scope=${authenticationRequest.scope}`,
        {
          ContentType: authenticationRequest.contentType,
          Authorization: `Basic ${base64Credentials}`,
        },
      );
      if (!response?.data.access_token) {
        throw new Error('A valid token could not be obtained.');
      }
      authenticationToken.accessToken = response?.data.access_token;
      expiresIn = response.data.expires_in;
      await this._cache.setEx(OMNIPAY_BEARER_TOKEN, expiresIn, authenticationToken);
    }

    return authenticationToken;
  }
}
