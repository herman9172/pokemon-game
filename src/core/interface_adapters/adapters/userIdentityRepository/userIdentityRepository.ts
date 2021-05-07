// istanbul ignore file

import { env } from '@config/env';
import { CognitoUtils } from '@core/application_business_rules/utils/cognitoUtils';
import { CognitoErrorCodes } from '@core/enterprise_business_rules/constants/errorCodes';
import { ConflictError } from '@core/enterprise_business_rules/entities/errors/conflictError';
import { ServerError } from '@core/enterprise_business_rules/entities/errors/serverError';
import { ILogRepository } from '@core/interface_adapters/adapters/logRepository/iLogRepository';
import { IUserIdentityRepository } from '@core/interface_adapters/adapters/userIdentityRepository/iUserIdentityRepository';
import { IUser } from '@lib/enterprise_business_rules/api_contract/users/iUser';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { AdminCreateUserRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';

export class UserIdentityRepository implements IUserIdentityRepository {
  protected cognitoUserPoolId: string;
  protected cognitoUserPoolClientId: string;

  constructor(protected readonly logger: ILogRepository) {
    this.cognitoUserPoolId = env.COGNITO_POOL_ID;
    this.cognitoUserPoolClientId = env.COGNITO_POOL_CLIENT_ID;
  }

  async createCognitoUser(user: IUser): Promise<IUser> {
    this.logger.debug({
      message: 'UserIdentityRepository:createCognitoUser',
      data: { user },
    });

    try {
      const cognito = new CognitoIdentityServiceProvider();
      const createParams: AdminCreateUserRequest = {
        Username: user.username,
        TemporaryPassword: user.password,
        UserAttributes: CognitoUtils.getAttributesFromUser(user),
        UserPoolId: this.cognitoUserPoolId,
        DesiredDeliveryMediums: ['EMAIL'],
      };

      const data = await cognito.adminCreateUser(createParams).promise();

      return CognitoUtils.mapUserFromCognito(data.User);
    } catch (err) {
      // Provide the FE with a better error code for already existing username
      if (err.code === 'UsernameExistsException') {
        const errorMessage = `The username with email ${user.username} already exists.`;
        this.logger.error({ message: errorMessage, data: { body: err } });
        throw new ConflictError(errorMessage, CognitoErrorCodes.COGNITO_USERNAME_EXISTS);
      }
      throw err;
    }
  }

  async deleteCognitoUser(user: IUser): Promise<void> {
    this.logger.debug({ method: 'UserIdentityRepository.deleteCognitoUser', data: { body: user.sub } });

    const cognito = new CognitoIdentityServiceProvider();
    await cognito
      .adminDeleteUser({
        UserPoolId: this.cognitoUserPoolId,
        Username: user.username,
      })
      .promise();
  }

  async updateUserAttribute(user: IUser): Promise<void> {
    this.logger.debug({
      method: 'UserIdentityRepository.updateUserAttribute',
      message: 'CreateUserRequest received',
      data: { user },
    });

    const requestParams = {
      UserAttributes: CognitoUtils.getAttributesFromUser(user),
      UserPoolId: this.cognitoUserPoolId,
      Username: user.username,
    };

    this.logger.debug({
      method: 'UserIndentityRepository.updateUserAttribute',
      message: 'Request params',
      data: { user, requestParams },
    });

    const cognitoClient = new CognitoIdentityServiceProvider({ region: process.env.REGION });

    try {
      await cognitoClient.adminUpdateUserAttributes(requestParams).promise();
    } catch (error) {
      this.logger.error({ method: 'UserIndentityRepository.updateUserAttribute error', data: { error } });
      throw new ServerError(error.message, CognitoErrorCodes.COGNITO_UPDATE_ATTRIBUTES_ERROR);
    }
  }

  async toggleEnableCognitoUser(user: IUser): Promise<void> {
    this.logger.debug({ method: 'UserIndentityRepository.disableCognitoUser', data: { user } });

    const cognito = new CognitoIdentityServiceProvider();
    const operation = user.enabled ? cognito.adminEnableUser.bind(cognito) : cognito.adminDisableUser.bind(cognito);
    await operation({
      UserPoolId: this.cognitoUserPoolId,
      Username: user.username,
    }).promise();
  } // end of toggleEnableCognitoUser
  async resendUserTemporaryPassword(user: IUser): Promise<IUser> {
    this.logger.debug({
      message: 'UserIdentityRepository:resendUserTemporaryPassword',
      data: user,
    });
    const cognito = new CognitoIdentityServiceProvider();
    const data = await cognito
      .adminCreateUser({ ...this.getCreateUserRequest(user), MessageAction: 'RESEND' })
      .promise();

    return CognitoUtils.mapUserFromCognito(data.User);
  }

  private getCreateUserRequest(user: IUser): AdminCreateUserRequest {
    return {
      Username: user.username,
      TemporaryPassword: user.password,
      UserAttributes: CognitoUtils.transformCognitoAttributes({
        phone_number: user.phone,
        email: user.email,
        name: user.firstName,
        family_name: user.lastName,
        email_verified: 'true',
      }),
      UserPoolId: this.cognitoUserPoolId,
      DesiredDeliveryMediums: ['EMAIL'],
    };
  }
}
