import { IUser } from '@lib/enterprise_business_rules/api_contract/users/iUser';
import { IUserAgent } from '@lib/enterprise_business_rules/entities/iUserAgent';

export const userStub: IUser = {
  firstName: 'Santa',
  lastName: 'Claus',
  email: 'santa.claus@omni.cr',
  password: '1234A1234a',
  phone: '+50688776655',
  countryCode: '506',
  sub: '7a2e1e5e92ffca2cc1ea53110a0c6278',
  userPin: '1234',
  id: 3495583,
  documentNumber: '114570665',
  documentType: '01',
  sk: 'c4b5b20d-1500-467a-a4bb-a3fff4897a6e',
  secondLastName: 'Marry',
  fcmToken: 'dkfjgdfgh78y',
  isTaxiDriver: false,
};

export const userAgentStub: IUserAgent = {
  firstName: 'Santa',
  lastName: 'Claus',
  email: 'santa.claus@omni.cr',
  password: '1234A1234a',
  phone: '+50688776655',
  countryCode: '506',
  sub: '7a2e1e5e92ffca2cc1ea53110a0c6278',
  userPin: '1234',
  id: 3495583,
  documentNumber: '114570665',
  documentType: '01',
  sk: 'c4b5b20d-1500-467a-a4bb-a3fff4897a6e',
  secondLastName: 'Marry',
  fcmToken: 'dkfjgdfgh78y',
  isTaxiDriver: false,
};
