import { IUser } from '@lib/enterprise_business_rules/api_contract/users/iUser';

export interface IUsersRepository {
  upsertUser(user: IUser): Promise<IUser>;
  getUser(email: string): Promise<IUser>;
}
