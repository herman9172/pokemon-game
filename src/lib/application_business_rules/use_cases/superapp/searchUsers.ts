// istanbul ignore file

import { ILogRepository } from '@core/interface_adapters/adapters';
import { ISuperappRepository } from '@lib/interface_adapters/storage/superapp_repository/iSuperappRepository';

export class SearchUsers {
  constructor(private readonly superappRepository: ISuperappRepository, private readonly logger: ILogRepository) {}

  async search(filter: string): Promise<any> {
    this.logger.debug({
      method: 'SearchUsers.search',
      data: { filter },
    });

    return this.superappRepository.searchUsers(filter);
  } // end of search
}
