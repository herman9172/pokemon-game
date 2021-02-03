import { env } from '@config/env';
import { StringGenerators } from '@core/application_business_rules/utils';
import { ILogRepository } from '@core/interface_adapters/adapters';
import { IInvokeRepository } from '@core/interface_adapters/adapters/invokeRepository/iInvokeRepository';
import { ISqsRepository } from '@core/interface_adapters/adapters/sqsRepository/iSqsRepository';
import { IGenerateQrCodePointsOfSaleRequest, IGenerateQrCodeRequest } from '@handlers/generateQrCodeHandler';
import { IMerchant, IMerchantPointOfSale, IMerchantStore } from '@lib/enterprise_business_rules/api_contract/merchants';
import { IPreregistrationMerchantsRequest } from '@lib/enterprise_business_rules/api_contract/merchants/iPreregistrationMerchantsRequest';
import { merchantStatus, merchantTypes } from '@lib/enterprise_business_rules/constants';
import { lambdas } from '@lib/enterprise_business_rules/constants/lambdas';
import { Merchant } from '@lib/enterprise_business_rules/entities';
import { IMerchantsRepository } from '@lib/interface_adapters/storage/merchants_repository/iMerchantsRepository';

export class PreRegisterMerchant {
  static getMerchant(storeAmount: number, pointOfSaleAmount: number): Merchant {
    return new Merchant({
      clientId: '',
      accountTypeId: merchantTypes.PREREGISTERED,
      documentNumber: `00${StringGenerators.getRandomNumericId(7)}`,
      comercialName: `Comercio Pregistro ${StringGenerators.getRandomLetterId(5)}`,
      status: merchantStatus.ARCHIVED,
      userSub: 'preregistro@omni.cr',
      contact: {
        name: `Contacto Pregistro ${StringGenerators.getRandomLetterId(5)}`,
        email: 'preregistro@omni.cr',
      },
      stores: PreRegisterMerchant.getStore(storeAmount, pointOfSaleAmount),
    });
  } // end of getMerchant

  static getStore(storeAmount: number, pointOfSaleAmount: number): Array<IMerchantStore> {
    const stores = [];
    for (let storeIndex = 0; storeIndex < storeAmount; storeIndex++) {
      stores.push({
        name: `Sucursal Preregistro ${StringGenerators.getRandomLetterId(5)}`,
        pointOfSale: PreRegisterMerchant.getPointOfSale(pointOfSaleAmount),
        pointOfSaleQuantity: pointOfSaleAmount,
        active: false,
      });
      stores.push();
    }

    return stores;
  } // end of getStore

  static getPointOfSale(pointOfSaleAmount: number): Array<IMerchantPointOfSale> {
    const pointOfSales = [];
    for (let pointOfSaleIndex = 0; pointOfSaleIndex < pointOfSaleAmount; pointOfSaleIndex++) {
      const posId = (pointOfSaleIndex + 1).toString();
      pointOfSales.push({
        PosId: posId,
        name: `Terminal ${posId}`,
        accessPin: '',
      });
      pointOfSales.push();
    }

    return pointOfSales;
  } // end of getPointOfSale

  static async invokePregistrationLambda(
    preRegistrationRequest: IPreregistrationMerchantsRequest,
    invokeRepository: IInvokeRepository,
  ): Promise<void> {
    await invokeRepository.invokeEvent(lambdas.PREREGISTER_MERCHANTS, {
      body: JSON.stringify(preRegistrationRequest),
    });
  }

  constructor(
    private readonly merchantRepository: IMerchantsRepository,
    private readonly logger: ILogRepository,
    private readonly sqsRepository: ISqsRepository,
  ) {}

  async preRegisterMerchant(preRegistrationRequest: IPreregistrationMerchantsRequest): Promise<void> {
    this.logger.debug({
      method: 'PreRegisterMerchant.preRegisterMerchant',
      data: preRegistrationRequest,
    });

    const creationPromises: Array<Promise<void>> = [];
    const merchants: Array<IMerchant> = [];
    for (let index = 0; index < preRegistrationRequest.totalMerchants; index++) {
      const merchantsWithPointsOfSale = this.createPointsOfSale(preRegistrationRequest).then((merchant) => {
        merchants.push(merchant);
      });

      creationPromises.push(merchantsWithPointsOfSale);
    }

    await Promise.all(creationPromises);

    this.logger.debug({
      method: 'PreRegisterMerchant.preRegisterMerchant',
      message: 'Awaiting all merchants',
      data: { merchants },
    });

    await this.sendMessageToGenerateQrCodes(preRegistrationRequest, merchants);
  } // end of addMerchant

  async sendMessageToGenerateQrCodes(
    preRegistrationRequest: IPreregistrationMerchantsRequest,
    merchants: Array<IMerchant>,
  ): Promise<void> {
    const pointsOfSaleToRequest: Array<IGenerateQrCodePointsOfSaleRequest> = [];
    for (const serializedMerchant of merchants) {
      const merchant = new Merchant(serializedMerchant);
      const merchantPointsOfSaleToRequest = merchant.getPointOfSales().map(
        (pointOfSale): IGenerateQrCodePointsOfSaleRequest => ({
          merchantId: serializedMerchant.merchantId,
          merchantDocumentNumber: serializedMerchant.documentNumber,
          merchantComercialName: serializedMerchant.comercialName,
          storeId: pointOfSale.storeId,
          posId: pointOfSale.posId,
        }),
      );

      pointsOfSaleToRequest.push(...merchantPointsOfSaleToRequest);
    }

    const messageRequest: IGenerateQrCodeRequest = {
      sendTo: preRegistrationRequest.sendTo,
      pointsOfSale: pointsOfSaleToRequest,
    };

    const qrGeneratorQueueURL = await this.sqsRepository.getQueueUrl(env.MERCHANTS_QR_GENERATOR_QUEUE_NAME);
    const messagePayload = {
      QueueUrl: qrGeneratorQueueURL,
      MessageBody: JSON.stringify(messageRequest),
    };

    this.logger.debug({
      method: 'PreRegisterMerchant.generateStaticQr',
      message: 'Sending message to SQS',
      data: { message: messagePayload },
    });

    await this.sqsRepository.sendMessage(messagePayload);
  } // end of generateStaticQr

  private async createPointsOfSale(preRegistrationRequest: IPreregistrationMerchantsRequest): Promise<IMerchant> {
    const merchant = (
      await this.merchantRepository.addMerchant(
        PreRegisterMerchant.getMerchant(
          preRegistrationRequest.totalStores,
          preRegistrationRequest.totalPointOfSalesByStore,
        ),
      )
    ).serialize();

    merchant.stores = (await this.merchantRepository.getStores(merchant.merchantId, 10000)).list;
    for (const store of merchant.stores) {
      store.pointOfSale = (await this.merchantRepository.getPointOfSales(store.id, 500)).list;
    }

    this.logger.debug({
      method: 'PreRegisterMerchant.createPointsOfSale',
      message: 'Points of sale created',
      data: { merchant: merchant.merchantId },
    });

    return merchant;
  }
}
