import { IEmail } from '@core/enterprise_business_rules/api_contract/iEmail';

export interface IEmailRepository {
  sendEmailFromTemplate(message: IEmail): Promise<void>;
  sendEmail(email: IEmail): Promise<void>;
}
