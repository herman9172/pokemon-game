import { IBankAccount } from '@lib/enterprise_business_rules/api_contract/bank_accounts';
import { IEconomicActivity } from '@lib/enterprise_business_rules/api_contract/economic_activities';
import {
  IMerchantContact,
  IMerchantPointOfSale,
  IMerchantStore,
} from '@lib/enterprise_business_rules/api_contract/merchants';
import { IMerchant } from '@lib/enterprise_business_rules/api_contract/merchants/iMerchant';
import { merchantStatus, merchantTypes } from '@lib/enterprise_business_rules/constants/index';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class Merchant {
  //#region attrs
  @IsString()
  @IsOptional()
  private readonly _mainEmail: string;

  @IsString()
  @IsOptional()
  private readonly _mainPhoneNumber: string;

  @IsOptional()
  private readonly _merchantId?: number;

  @IsString()
  private readonly _clientId: string;

  @IsIn(Object.values(merchantTypes))
  private readonly _accountTypeId: merchantTypes;

  @IsString()
  private readonly _documentNumber: string;

  @IsString()
  private readonly _comercialName: string;

  @IsString()
  @IsOptional()
  private readonly _legalName: string;

  @IsString()
  @IsOptional()
  private readonly _iconAssetUrl: string;

  @IsIn(Object.values(merchantStatus))
  private readonly _status: merchantStatus;

  @IsString()
  private readonly _userSub: string;

  private readonly _stores: Array<IMerchantStore>;

  @IsOptional()
  private readonly _contact?: IMerchantContact;

  @IsOptional()
  private readonly _hasInternetConnection?: boolean;

  @IsOptional()
  private readonly _totalStores: number;

  @IsOptional()
  private readonly _totalPointOfSales: number;

  @IsOptional()
  private readonly _totalUsers: number;

  @IsOptional()
  private readonly _createdAt?: number | string;

  @IsOptional()
  private readonly _mccEconomicActivity?: IEconomicActivity;

  @IsOptional()
  private readonly _bankAccount?: IBankAccount;
  constructor(merchant: IMerchant) {
    this._merchantId = merchant.merchantId;
    this._clientId = merchant.clientId;
    this._accountTypeId = merchant.accountTypeId;
    this._documentNumber = merchant.documentNumber;
    this._comercialName = merchant.comercialName;
    this._mainPhoneNumber = merchant.mainPhoneNumber;
    this._mainEmail = merchant.mainEmail;
    this._legalName = merchant.legalName;
    this._iconAssetUrl = merchant.iconAssetUrl;
    this._status = merchant.status;
    this._userSub = merchant.userSub;
    this._contact = merchant.contact;
    this._stores = merchant.stores;
    this._hasInternetConnection = merchant.hasInternetConnection;
    this._createdAt = merchant.createdAt;
    this._totalStores = merchant.totalStores;
    this._totalPointOfSales = merchant.totalPointOfSales;
    this._totalUsers = merchant.totalUsers;
    this._mccEconomicActivity = merchant.mccEconomicActivity;
    this._bankAccount = merchant.bankAccount;
  }

  //#endregion attrs

  //#region gets

  getMainEmail(): string {
    return this._mainEmail;
  }

  getMainPhoneNumber(): string {
    return this._mainPhoneNumber;
  }

  getMerchant(): number {
    return this._merchantId;
  }

  getClientId(): string {
    return this._clientId;
  }

  getAccountTypeId(): merchantTypes {
    return this._accountTypeId;
  }

  getDocumentNumber(): string {
    return this._documentNumber;
  }

  getComercialName(): string {
    return this._comercialName;
  }

  getMerchantStatus(): merchantStatus {
    return this._status;
  }

  getUserSub(): string {
    return this._userSub;
  }

  getStores(): Array<IMerchantStore> {
    return this._stores || [];
  }

  getContact(): IMerchantContact {
    return this._contact;
  }

  gethasInternetConnection(): boolean {
    return this._hasInternetConnection;
  }

  getCreatedAt(): number | string {
    return this._createdAt;
  }

  getTotalStores(): number {
    return this._totalStores;
  }

  getTotalPointOfSales(): number {
    return this._totalPointOfSales;
  }

  getTotalUsers(): number {
    return this._totalUsers;
  }

  getMccEconomicActivity(): IEconomicActivity {
    return this._mccEconomicActivity;
  }

  getBankAccount(): IBankAccount {
    return this._bankAccount;
  }

  getPointOfSales(): Array<IMerchantPointOfSale> {
    const pointOfSales = [];
    for (const store of this.getStores()) {
      pointOfSales.push(...(store.pointOfSale || []));
    }

    return pointOfSales;
  }

  //#endregion gets

  // setRegistrationStatus(status: registrationStatus) {
  //   this._contact.registrationStatus = status;
  // }

  serialize(): IMerchant {
    return {
      merchantId: this._merchantId,
      clientId: this._clientId,
      accountTypeId: this._accountTypeId,
      documentNumber: this._documentNumber,
      comercialName: this._comercialName,
      mainPhoneNumber: this._mainPhoneNumber,
      mainEmail: this._mainEmail,
      legalName: this._legalName,
      iconAssetUrl: this._iconAssetUrl,
      status: this._status,
      userSub: this._userSub,
      contact: this._contact,
      stores: this._stores,
      hasInternetConnection: this._hasInternetConnection,
      createdAt: this._createdAt,
      totalPointOfSales: this._totalPointOfSales,
      totalStores: this._totalStores,
      totalUsers: this._totalUsers,
      mccEconomicActivity: this._mccEconomicActivity,
      bankAccount: this._bankAccount,
    };
  }
}
