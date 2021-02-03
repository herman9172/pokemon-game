import { IUser } from '@lib/enterprise_business_rules/api_contract/users/iUser';

export interface IUserIdentityRepository {
  createCognitoUser(user: IUser): Promise<IUser>;
  deleteCognitoUser(user: IUser): Promise<void>;
  updateUserAttribute(user: IUser): Promise<void>;
  toggleEnableCognitoUser(user: IUser): Promise<void>;
  resendUserTemporaryPassword(user: IUser): Promise<IUser>;
}
