import { IMerchant } from '@lib/enterprise_business_rules/api_contract/merchants/iMerchant';
import { merchantContactTypes } from '@lib/enterprise_business_rules/constants/merchantContactTypes';
import { registrationStatus } from '@lib/enterprise_business_rules/constants/registrationStatus';

export const merchantData: IMerchant = {
  clientId: 'id-test',
  accountTypeId: 2,
  documentNumber: '1',
  comercialName: 'merchant name',
  legalName: 'merchant name',
  iconAssetUrl: 'url',
  status: 1,
  userSub: 'user-sub',
  hasInternetConnection: true,
  contact: {
    userSub: 'user-sub',
    name: 'Juan',
    phone: '+50688888888',
    email: 'email@email.com',
    password: 'password',
    status: 1,
    jobRole: merchantContactTypes.DEPENDANT,
    registrationStatus: registrationStatus.CONFIRMED,
    documentNumber: '123',
    username: 'username',
  },
  mccEconomicActivity: {
    id: 1,
    name: 'SERVICIOS VETERINARIOS',
    category: {
      id: 1,
      name: 'AGROPECUARIO',
    },
    code: 742,
    details:
      'Comercios clasificados bajo este MCC son practicantes licenciados de medicina, odontología o cirugía veterinaria. Este MCC incluye practicantes médicos para mascotas (Ejemplo: perros y gatos), ganado (Ejemplo: reses, caballos, ovejas, cerdos, cabras y aves de corral), así como animales exóticos.',
  },
  stores: [
    {
      name: 'tienda 1',
      location: {
        country: 'Costa Rica',
        province: 'Alajuela',
        district: 'Alajuela',
        canton: 'Alajuela',
        address: 'Alajuela',
        latitude: 12345.1,
        longitude: 345475.4,
      },
      economicActivity: 'test',
      mainPhone: 'mainPhone',
      pointOfSale: [
        {
          posId: 'id-2',
          name: 'name',
        },
        {
          posId: 'id-2',
          name: 'name',
        },
      ],
    },
  ],
};
