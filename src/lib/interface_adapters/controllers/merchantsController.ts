import { IRequest } from '@core/enterprise_business_rules/api_contract';
import { ValidationError } from '@core/enterprise_business_rules/entities/errors';
import { GetMerchant } from '@lib/application_business_rules/use_cases/merchants/getMerchant';
import { PreRegisterMerchant } from '@lib/application_business_rules/use_cases/merchants/preRegisterMerchant';
import { IPreregistrationMerchantsRequest } from '@lib/enterprise_business_rules/api_contract/merchants/iPreregistrationMerchantsRequest';
import { Merchant } from '@lib/enterprise_business_rules/entities';
import { IServices } from '@lib/framework_drivers/config/app';
import { isNumber } from 'class-validator';

export class MerchantsController {
  static async getMerchantInformation(request: IRequest, services: IServices): Promise<Merchant> {
    const getMerchantInformation = new GetMerchant(services.merchantRepository, services.logRepository);
    const merchantId = +request.params.merchant_id;
    if (!isNumber(merchantId)) {
      throw new ValidationError('asd', undefined);
    }

    return getMerchantInformation.getMerchant(merchantId);
  } // end of getMerchant

  static async preRegisterMerchant(request: IRequest, services: IServices): Promise<void> {
    const params: IPreregistrationMerchantsRequest = request.jsonBody;
    const preregistrationRequest: IPreregistrationMerchantsRequest = {
      sendTo: params.sendTo || [],
      totalMerchants: params.totalMerchants || 1,
      totalStores: params.totalStores || 1,
      totalPointOfSalesByStore: params.totalPointOfSalesByStore || 1,
    };

    if (!params.sendTo) {
      throw new ValidationError('An email has to be set to send the generated QR codes', undefined);
    }

    await PreRegisterMerchant.invokePregistrationLambda(preregistrationRequest, services.invokeRepository);
  } // end of preRegisterMerchant
}
