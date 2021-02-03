import { IRequest } from '@core/enterprise_business_rules/api_contract';
import { ValidationError } from '@core/enterprise_business_rules/entities/errors';
import { GetMerchant } from '@lib/application_business_rules/use_cases/merchants/getMerchant';
import { IMerchant } from '@lib/enterprise_business_rules/api_contract/merchants';
import { Merchant } from '@lib/enterprise_business_rules/entities';
import { MerchantsController } from '@lib/interface_adapters/controllers/merchantsController';
import { servicesStub } from '@tests/stubs/servicesStubs';

describe('Merchant Controller', () => {
  describe('getMerchantInformation', () => {
    const requestStub: IRequest = {
      params: {
        merchant_id: '123',
      },
    };

    it('should call the use case', async () => {
      const merchantStub: IMerchant = {
        comercialName: '123',
      };

      const useCaseSpy = spyOn(GetMerchant.prototype, 'getMerchant').and.returnValue(new Merchant(merchantStub));

      await MerchantsController.getMerchantInformation(requestStub, servicesStub);

      expect(useCaseSpy).toHaveBeenCalledTimes(1);
    });

    it('should throw validation error when the merchant id is NaN', async () => {
      expect.assertions(1);

      const badRequestStub: IRequest = {
        params: {
          merchant_id: 'NOT_A_NUMBER',
        },
      };

      try {
        spyOn(GetMerchant.prototype, 'getMerchant');
        await MerchantsController.getMerchantInformation(badRequestStub, servicesStub);
      } catch (err) {
        expect(err).toBeInstanceOf(ValidationError);
      }
    });

    it('should not call the use case when there is a validation error', async () => {
      expect.assertions(1);

      const badRequestStub: IRequest = {
        params: {
          merchant_id: 'NOT_A_NUMBER',
        },
      };

      const useCaseSpy = spyOn(GetMerchant.prototype, 'getMerchant');

      try {
        await MerchantsController.getMerchantInformation(badRequestStub, servicesStub);
      } catch (err) {
        expect(useCaseSpy).not.toHaveBeenCalled();
      }
    });
  }); // end of getMerchantInformation
});
