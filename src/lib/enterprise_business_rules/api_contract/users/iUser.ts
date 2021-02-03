import { UserStatus } from '@core/interface_adapters/adapters/userIdentityRepository/userStatus';

export interface IUser {
  id?: number;
  sub?: string;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  userStatus?: UserStatus;
  enabled?: boolean;
  createdAt?: number;
}
