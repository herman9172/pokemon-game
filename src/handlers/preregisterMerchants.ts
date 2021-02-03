import { BaseError } from '@core/enterprise_business_rules/entities/errors';
import { IInvoke } from '@core/interface_adapters/adapters/invokeRepository/invokeRepository';
import { PreRegisterMerchant } from '@lib/application_business_rules/use_cases/merchants/preRegisterMerchant';
import { IPreregistrationMerchantsRequest } from '@lib/enterprise_business_rules/api_contract/merchants/iPreregistrationMerchantsRequest';
import { App } from '@lib/framework_drivers/config/app';
import { Context, Handler } from 'aws-lambda';

const handler: Handler = async (event: IInvoke, context: Context): Promise<void> => {
  const app = new App();
  const { services } = app;

  services.logRepository.info({
    method: 'PreregisterMerchants.handler',
    message: 'Start preregistration controller',
    data: { event, context },
  });

  try {
    const preRegistrationRequest: IPreregistrationMerchantsRequest = JSON.parse(event.body);

    const preRegisterMerchant = new PreRegisterMerchant(
      services.merchantRepository,
      services.logRepository,
      services.sqsRepository,
    );

    await preRegisterMerchant.preRegisterMerchant(preRegistrationRequest);
  } catch (err) {
    services.logRepository.error({
      method: 'PreregisterMerchants.handler',
      message: 'An error occurred',
      data: { error: BaseError.serialize(err) },
    });

    await app.dispose();

    throw err;
  }
};

export { handler };
