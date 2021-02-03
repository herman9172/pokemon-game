import { IPaginatedResponse } from '@lib/enterprise_business_rules/api_contract/iPaginatedResponse';
import { IMerchantPointOfSale, IMerchantStore } from '@lib/enterprise_business_rules/api_contract/merchants';
import { IMerchantQrCode } from '@lib/enterprise_business_rules/api_contract/merchants/iMerchantQrCode';
import { Merchant } from '@lib/enterprise_business_rules/entities/merchant';

export interface IMerchantsRepository {
  getMerchant(merchantId: number): Promise<Merchant>;
  addMerchant(merchant: Merchant): Promise<Merchant>;
  getStores(
    merchantId: number,
    limit: number,
    nextPageToken?: string,
    filter?: string,
  ): Promise<IPaginatedResponse<IMerchantStore>>;
  getPointOfSales(
    storeId: number,
    limit: number,
    nextPageToken?: string,
    filter?: string,
  ): Promise<IPaginatedResponse<IMerchantPointOfSale>>;
  getStaticQrCode(storeId: string, posId: string): Promise<IMerchantQrCode>;
}
