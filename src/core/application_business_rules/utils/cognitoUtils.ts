import { CognitoAttributes } from '@core/enterprise_business_rules/constants/cognitoAttributes';
import { IUser } from '@lib/enterprise_business_rules/api_contract/users/iUser';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { AttributeType, UserType } from 'aws-sdk/clients/cognitoidentityserviceprovider';

interface IUserIdentityAttributes {
  [name: string]: string;
}

export class CognitoUtils {
  static getAttributesFromUser(user: IUser): Array<AttributeType> {
    return CognitoUtils.transformCognitoAttributes({
      [CognitoAttributes.PHONE]: user.phone,
      [CognitoAttributes.EMAIL]: user.email,
      [CognitoAttributes.NAME]: user.firstName,
      [CognitoAttributes.FAMILY_NAME]: user.lastName,
      [CognitoAttributes.EMAIL_VERIFIED]: 'true',
    });
  }

  static transformCognitoAttributes(attributes: IUserIdentityAttributes): Array<AttributeType> {
    const cognitoAttributes: Array<AttributeType> = [];
    for (const key of Object.keys(attributes)) {
      if (attributes[key]) {
        cognitoAttributes.push({ Name: key, Value: attributes[key] });
      }
    }

    return cognitoAttributes;
  }

  static mapUserFromCognito(cognitoUser: UserType): IUser {
    const { Username, Attributes, Enabled } = cognitoUser;

    return {
      username: Username,
      sub: CognitoUtils.getCognitoUserAttribute(Attributes, CognitoAttributes.SUB),
      firstName: CognitoUtils.getCognitoUserAttribute(Attributes, CognitoAttributes.NAME),
      lastName: CognitoUtils.getCognitoUserAttribute(Attributes, CognitoAttributes.FAMILY_NAME),
      phone: CognitoUtils.getCognitoUserAttribute(Attributes, CognitoAttributes.PHONE),
      email: CognitoUtils.getCognitoUserAttribute(Attributes, CognitoAttributes.EMAIL),
      enabled: Enabled,
    };
  }

  private static getCognitoUserAttribute(
    attributes: CognitoIdentityServiceProvider.AttributeListType,
    attribute: string,
  ): string {
    const dataAttribute = attributes.filter((attr) => attr.Name === attribute);

    return dataAttribute && dataAttribute[0] && dataAttribute[0].Value;
  }
}
