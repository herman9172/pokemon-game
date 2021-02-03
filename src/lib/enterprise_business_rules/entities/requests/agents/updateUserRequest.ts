import { IUser } from '@lib/enterprise_business_rules/api_contract/users/iUser';
import { IsBoolean, IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserRequest {
  @IsEmail()
  protected email?: string;

  @IsPhoneNumber('ZZ')
  protected phone?: string;

  @IsString()
  protected readonly firstName: string;

  @IsString()
  protected readonly lastName: string;

  @IsBoolean()
  protected enabled?: boolean;

  constructor(user: IUser) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.phone = user.phone;
    this.enabled = user.enabled;
  }

  toUser(): IUser {
    return {
      username: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
      enabled: this.enabled,
    };
  }
}
