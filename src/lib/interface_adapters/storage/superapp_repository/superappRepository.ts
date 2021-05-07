// istanbul ignore file

import { env } from '@config/env';
import { ILogRepository, IRequestRepository } from '@core/interface_adapters/adapters';
import { ISuperappRepository } from '@lib/interface_adapters/storage/superapp_repository/iSuperappRepository';

export class SuperappRepository implements ISuperappRepository {
  constructor(private readonly requestRepository: IRequestRepository, private readonly logRepository: ILogRepository) {}

  async searchUsers(filter: string): Promise<any> {
    const merchantUrl = `${env.SUPERAPP_SERVICE_URL}/core/search-user?filter=${filter}`;
    this.logRepository.debug({
      method: 'MerchantsRepository.searchUsers',
      data: { filter },
    });

    const response = await this.requestRepository.doGet(merchantUrl);

    return response.result;
  }
}
