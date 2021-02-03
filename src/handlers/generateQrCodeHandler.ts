import { TimeUtils } from '@core/application_business_rules/utils/timeUtils';
import { IEmail } from '@core/enterprise_business_rules/api_contract/iEmail';
import { BaseError } from '@core/enterprise_business_rules/entities/errors';
import { EmailRepositoryMandrill } from '@core/interface_adapters/adapters';
import { App, IServices } from '@lib/framework_drivers/config/app';
import { SQSEvent } from 'aws-lambda';
import { createObjectCsvStringifier } from 'csv-writer';

export interface IGenerateQrCodeRequest {
  sendTo: Array<{ name: string; email: string }>;
  pointsOfSale: Array<IGenerateQrCodePointsOfSaleRequest>;
}

export interface IGenerateQrCodePointsOfSaleRequest {
  merchantId: number;
  merchantDocumentNumber: string;
  merchantComercialName: string;
  storeId: string;
  posId: string;
  posQrCodeId?: string;
  posQrCodeUrl?: string;
}

/**
 * This handler process a batch of messages from SQS
 * (up to the batchSize specified in the lambda event)
 *
 * Each message includes a request to send a report of QR codes generated from new merchants
 * The queue has a delay time setting so this handler is not triggered immediately.
 * Check the `serverless.yml` queue definition for more details.
 */
const handler = async (event: SQSEvent): Promise<void> => {
  const app = new App();
  const { services } = app;

  services.logRepository.info({
    method: 'GenerateQrCodeHandler.handler',
    message: 'Generate QR Code',
    data: { event },
  });

  try {
    for (const sqsMessage of event.Records) {
      const generateQrCodeRequest: IGenerateQrCodeRequest = JSON.parse(sqsMessage.body);

      await generateQrCodes(services, generateQrCodeRequest);
    }
  } catch (err) {
    services.logRepository.error({
      method: 'GenerateQrCodeHandler.handler',
      message: 'An error occurred',
      data: { error: BaseError.serialize(err) },
    });

    throw err;
  } finally {
    await app.dispose();
  }
};

const generateQrCodes = async (services: IServices, generateQrCodeRequest: IGenerateQrCodeRequest): Promise<void> => {
  services.logRepository.info({
    method: 'GenerateQrCodeHandler.generateQrCode',
    message: 'Request to generate QR codes',
    data: { generateQrCodeRequest },
  });

  const posQrCodes = generateQrCodeRequest.pointsOfSale.map(async (pointOfSale) => {
    services.logRepository.info({
      method: 'GenerateQrCodeHandler.generateQrCode',
      message: 'Generating QR to POS',
      data: { pointOfSale },
    });

    try {
      await TimeUtils.sleep(1000, 10000);
      const qrCode = await services.merchantRepository.getStaticQrCode(pointOfSale.storeId, pointOfSale.posId);
      pointOfSale.posQrCodeUrl = qrCode.qrCodeImage;
      pointOfSale.posQrCodeId = qrCode.qrCodeId;

      services.logRepository.info({
        method: 'GenerateQrCodeHandler.generateQrCode',
        message: 'QR code generated',
        data: { qrCode },
      });
    } catch (err) {
      services.logRepository.error({
        method: 'GenerateQrCodeHandler.generateQrCode',
        message: 'An error occurred processing the QR code',
        data: { error: BaseError.serialize(err) },
      });
    }
  });

  // await until all QR codes are generated
  await Promise.all(posQrCodes);

  await sendEmailWithCodes(generateQrCodeRequest, services);
};

const sendEmailWithCodes = async (generateQrCodeRequest: IGenerateQrCodeRequest, services: IServices) => {
  services.logRepository.info({
    method: 'MerchantsHandlers.sendEmailWithCodes',
    message: 'Generating CSV to send to email',
  });

  const csvStringifier = createObjectCsvStringifier({
    header: [
      { id: 'merchantId', title: 'ID del comercio' },
      { id: 'merchantDocumentNumber', title: 'Cedula autogenerada del comercio' },
      { id: 'merchantComercialName', title: 'Nombre del comercio' },
      { id: 'storeId', title: 'ID de sucursal' },
      { id: 'posId', title: 'ID del terminal' },
      { id: 'posQrCodeId', title: 'ID Codigo QR' },
      { id: 'posQrCodeUrl', title: 'URL Codigo QR' },
    ],
  });

  const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(generateQrCodeRequest.pointsOfSale);

  const emailDetails: IEmail = {
    fromEmail: 'email@omni.cr',
    fromName: 'OMNi Merchants',
    to: generateQrCodeRequest.sendTo.map((recipient) => ({
      email: recipient.email,
      name: recipient.name,
      type: 'to',
    })),
    subject: 'Códigos QR autogenerados',
    text: 'Este mensaje es enviado automáticamente despues de autogenerar códigos QR.\n',
    attachments: [
      {
        content: EmailRepositoryMandrill.encodeAttachment(csv),
        name: `codigos_QR_autogenerados_${Date.now()}.csv`,
        type: 'text/csv',
      },
    ],
  };

  await services.emailRepository.sendEmail(emailDetails);

  services.logRepository.info({
    method: 'MerchantsHandlers.sendEmailWithCodes',
    message: 'Email sent.',
  });
};

export { handler };
