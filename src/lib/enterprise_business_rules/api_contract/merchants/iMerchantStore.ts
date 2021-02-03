import { IMerchantLocation, IMerchantPointOfSale } from '@lib/enterprise_business_rules/api_contract/merchants/index';

export interface IMerchantStore {
  id?: number;
  name?: string;
  location?: IMerchantLocation;
  pointOfSale?: Array<IMerchantPointOfSale>;
  pointOfSaleQuantity?: number;
  economicActivity?: string;
  active?: boolean;
  mainPhone?: string;
}
