import { IBankAccount } from '@lib/enterprise_business_rules/api_contract/bank_accounts';
import { IEconomicActivity } from '@lib/enterprise_business_rules/api_contract/economic_activities';
import { IMerchantContact, IMerchantStore } from '@lib/enterprise_business_rules/api_contract/merchants';
import { merchantStatus, merchantTypes, registrationStatus } from '@lib/enterprise_business_rules/constants';

export interface IMerchant {
  mainEmail?: any;
  mainEconomicActivity?: string;
  merchantId?: number;
  clientId?: string;
  accountTypeId?: merchantTypes;
  documentNumber?: string;
  comercialName?: string;
  mainPhoneNumber?: string;
  legalName?: string;
  iconAssetUrl?: string;
  status?: merchantStatus;
  userSub?: string;
  contact?: IMerchantContact;
  stores?: Array<IMerchantStore>;
  registrationStatus?: registrationStatus;
  hasInternetConnection?: boolean;
  createdAt?: number | string;
  totalUsers?: number;
  totalPointOfSales?: number;
  totalStores?: number;
  mccEconomicActivity?: IEconomicActivity;
  bankAccount?: IBankAccount;
}
