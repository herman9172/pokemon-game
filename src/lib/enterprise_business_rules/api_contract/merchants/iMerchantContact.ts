import { merchantContactTypes, merchantStatus, registrationStatus } from '@lib/enterprise_business_rules/constants';

export interface IMerchantContact {
  id?: string;
  name: string;
  phone?: string;
  merchantId?: number;
  email?: string;
  password?: string;
  status?: merchantStatus;
  jobRole?: merchantContactTypes;
  registrationStatus?: registrationStatus;
  userSub?: string;
  documentNumber?: string;
  mainStoreId?: number;
  mainStoreName?: string;
  username?: string;
}
