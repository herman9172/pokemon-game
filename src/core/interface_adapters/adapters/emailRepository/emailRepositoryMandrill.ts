// istanbul ignore file

import { IEmail } from '@core/enterprise_business_rules/api_contract/iEmail';
import { CoreErrorCodes } from '@core/enterprise_business_rules/constants';
import { ServerError } from '@core/enterprise_business_rules/entities/errors';
import { ILogRepository } from '@core/interface_adapters/adapters';
import { IEmailRepository } from '@core/interface_adapters/adapters/emailRepository/iEmailRepository';
import { Mandrill } from 'mandrill-api';

interface IEmailCredentials {
  apiKey: string;
  url: string;
  listId: string;
  mailchimpApiKey: string;
  fromEmail: string;
  fromName: string;
}

export class EmailRepositoryMandrill implements IEmailRepository {
  private emailCredentials: IEmailCredentials;

  static encodeAttachment(fileContent: string): string {
    return Buffer.from(fileContent).toString('base64');
  }

  private static async getEmailCredentials(): Promise<IEmailCredentials> {
    // const secret = (await this.secretManagerRepository.getKeyFromSecretsManager({
    //   secretName: `${env.STAGE}/email`,
    // })) as string;
    //
    // return JSON.parse(secret);
    return {
      apiKey: 'qbKiLpktxPL7W7vdTrB4RA',
      url: 'https://us19.api.mailchimp.com',
      listId: '281965793e',
      mailchimpApiKey: '3808e61a6ba23355e1e503c8aa8b3c1d-us19',
      fromEmail: 'email@omni.cr',
      fromName: 'OMNi',
    };
  }
  constructor(private readonly logger: ILogRepository) {}

  async sendEmailFromTemplate(email: IEmail): Promise<void> {
    this.logger.debug({ method: 'EmailRepositoryMandrill. send', data: { body: email } });

    this.emailCredentials = await EmailRepositoryMandrill.getEmailCredentials();

    const mandrillClient = new Mandrill(this.emailCredentials.apiKey);

    const sendTemplate = new Promise((resolve, reject) => {
      mandrillClient.messages.sendTemplate(
        {
          template_name: email.templateName,
          template_content: [],
          message: this.emailTemplate(email),
          async: true,
        },
        resolve,
        reject,
      );
    });

    try {
      await sendTemplate;
    } catch (error) {
      this.logger.error({
        method: 'EmailRepositoryMandrill.sendEmailTemplate',
        message: 'error',
        data: { error },
      });
      throw new ServerError('Error al enviar el correo', CoreErrorCodes.UNKNOWN);
    }
  }

  async sendEmail(email: IEmail): Promise<void> {
    this.logger.debug({ method: 'EmailRepositoryMandrill. send', data: { body: email } });

    const emailCredentials: IEmailCredentials = await EmailRepositoryMandrill.getEmailCredentials();

    const _email = {
      from_email: email.fromEmail,
      from_name: email.fromName,
      ...email,
    };

    const mandrillClient = new Mandrill(emailCredentials.apiKey);

    const send = new Promise((resolve, reject) => {
      mandrillClient.messages.send({ message: _email, async: true }, resolve, reject);
    });

    try {
      await send;
    } catch (error) {
      this.logger.error({ method: 'EmailRepositoryMandrill.sendEmail', message: 'error', data: { error } });
      throw new ServerError('Error al enviar el correo', CoreErrorCodes.UNKNOWN);
    }
  }

  private readonly emailTemplate = (email: IEmail) => ({
    subject: email.subject,
    from_email: email.fromEmail || this.emailCredentials.fromEmail,
    from_name: email.fromName || this.emailCredentials.fromName,
    to: email.to,
    autotext: true,
    track_opens: true,
    track_clicks: true,
    global_merge_vars: email.tags,
    attachments: email.attachments,
  });
}
