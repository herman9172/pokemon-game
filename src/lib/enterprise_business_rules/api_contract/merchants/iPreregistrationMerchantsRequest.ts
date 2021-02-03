export interface IPreregistrationMerchantsRequest {
  sendTo?: Array<{ name: string; email: string }>;
  totalMerchants?: number;
  totalStores?: number;
  totalPointOfSalesByStore?: number;
}
