import { GetMerchant } from '@lib/application_business_rules/use_cases/merchants/getMerchant';
import { loggerRepositoryStub, merchantRepositoryStub } from '@tests/stubs/servicesStubs';

describe('Get Merchant Uses Case', () => {
  let useCase: GetMerchant;

  beforeEach(() => {
    useCase = new GetMerchant(merchantRepositoryStub, loggerRepositoryStub);
  });

  it('should return the merchant information from the merchant repository', async () => {
    const merchantRepositorySpy = spyOn(merchantRepositoryStub, 'getMerchant');
    await useCase.getMerchant(1);

    expect(merchantRepositorySpy).toHaveBeenCalledTimes(1);
  });
});
