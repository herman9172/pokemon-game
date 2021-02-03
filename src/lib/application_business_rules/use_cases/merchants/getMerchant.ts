import { ILogRepository } from '@core/interface_adapters/adapters';
import { Merchant } from '@lib/enterprise_business_rules/entities/merchant';
import { IMerchantsRepository } from '@lib/interface_adapters/storage';

export class GetMerchant {
  constructor(private readonly merchantRepository: IMerchantsRepository, private readonly logger: ILogRepository) {}

  async getMerchant(merchantId: number): Promise<Merchant> {
    this.logger.debug({
      method: 'GetMerchant.getMerchant',
      data: merchantId,
    });

    return this.merchantRepository.getMerchant(merchantId);
  } // end of merchantInformation
}
