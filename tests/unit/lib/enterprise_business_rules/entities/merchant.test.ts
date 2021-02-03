import { Merchant } from '@lib/enterprise_business_rules/entities/merchant';
import { merchantData } from '@tests/stubs/merchants/merchantsStubs';

describe('Merchant entity', () => {
  it('should serialize the entity correctly', () => {
    const merchant = new Merchant({ ...merchantData });

    expect(merchant.serialize()).toMatchObject(merchantData);
  });
});
