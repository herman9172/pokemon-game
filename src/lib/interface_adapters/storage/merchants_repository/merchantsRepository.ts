import { env } from '@config/env';
import { ILogRepository, IRequestRepository } from '@core/interface_adapters/adapters';
import { IPaginatedResponse } from '@lib/enterprise_business_rules/api_contract/iPaginatedResponse';
import { IMerchantPointOfSale, IMerchantStore } from '@lib/enterprise_business_rules/api_contract/merchants';
import { IMerchantQrCode } from '@lib/enterprise_business_rules/api_contract/merchants/iMerchantQrCode';
import { Merchant } from '@lib/enterprise_business_rules/entities/merchant';
import { IMerchantsRepository } from '@lib/interface_adapters/storage';

export class MerchantsRepository implements IMerchantsRepository {
  constructor(private readonly requestRepository: IRequestRepository, private readonly logRepository: ILogRepository) {}

  async getMerchant(merchantId: number): Promise<Merchant> {
    this.logRepository.debug({
      method: 'MerchantsRepository.getMerchant',
      data: merchantId,
    });
    const merchantUrl = `${env.OMNIPAY_SERVICE_URL}/merchants/${merchantId}`;
    const  data  = await this.requestRepository.doGet(merchantUrl);
    const result = data?.result;

    return new Merchant({
      ...result,
      hasInternetConnection: result?.internetConnection === 'true',
    });
  } // end of getMerchant

  async addMerchant(merchant: Merchant): Promise<Merchant> {
    const merchantUrl = `${env.OMNIPAY_SERVICE_URL}/merchants`;
    this.logRepository.debug({
      method: 'MerchantRepository.addMerchant',
      data: merchant,
    });
    const { result } = await this.requestRepository.doPost(merchantUrl, merchant.serialize());

    return new Merchant(result);
  } // end of addMerchant

  async getStores(
    merchantId: number,
    limit: number,
    nextPageToken?: string,
    filter?: string,
  ): Promise<IPaginatedResponse<IMerchantStore>> {
    const merchantUrl = `${env.OMNIPAY_SERVICE_URL}/merchants/${merchantId}/stores`;
    this.logRepository.debug({
      method: 'MerchantRepository.getStores',
      data: merchantId,
    });

    const { result } = await this.requestRepository.doGet(merchantUrl, {
      limit,
      nextPageToken,
      filter,
    });

    return result;
  } // end of getStores

  async getPointOfSales(
    storeId: number,
    limit: number,
    nextPageToken?: string,
    filter?: string,
  ): Promise<IPaginatedResponse<IMerchantPointOfSale>> {
    const merchantUrl = `${env.OMNIPAY_SERVICE_URL}/stores/${storeId}/point-of-sales`;
    this.logRepository.debug({
      method: 'MerchantRepository.getPointOfSales',
      data: storeId,
    });

    const { result } = await this.requestRepository.doGet(merchantUrl, {
      limit,
      nextPageToken,
      filter,
    });

    return result;
  } // end of getPointOfSales

  async getStaticQrCode(storeId: string, posId: string): Promise<IMerchantQrCode> {
    const merchantUrl = `${env.OMNIPAY_SERVICE_URL}/stores/${storeId}/point-of-sales/${posId}/qrCode/static`;
    this.logRepository.debug({
      method: 'MerchantRepository.getStaticQrCode',
      data: { storeId, posId },
    });

    const { result } = await this.requestRepository.doGet(merchantUrl);

    return result;
  } // end of getStaticQrCode
}
