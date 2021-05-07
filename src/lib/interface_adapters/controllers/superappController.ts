// istanbul ignore file

import { IRequest } from '@core/enterprise_business_rules/api_contract';
import { ValidationError } from '@core/enterprise_business_rules/entities/errors';
import { SearchUsers } from '@lib/application_business_rules/use_cases/superapp/searchUsers';
import { Merchant } from '@lib/enterprise_business_rules/entities';
import { IServices } from '@lib/framework_drivers/config/app';

export class SuperappController {
  static async searchUsers(request: IRequest, services: IServices): Promise<Merchant> {
    const useCase = new SearchUsers(services.superappRepository, services.logRepository);

    const filter = request.queryStringParams?.filter;
    if (!filter) {
      throw new ValidationError('The parameter `filter` is required', undefined);
    }

    return useCase.search(filter);
  } // end of getMerchant
}
