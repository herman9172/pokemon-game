// istanbul ignore file

import { IUser } from '@lib/enterprise_business_rules/api_contract/users/iUser';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';

export class CreateUserRequest {
  @IsString()
  protected readonly firstName: string;

  @IsString()
  protected readonly lastName: string;

  @IsEmail()
  protected email?: string;

  @IsPhoneNumber('ZZ')
  protected phone?: string;

  constructor(user: IUser) {
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.phone = user.phone;
  }

  toUser(): IUser {
    return {
      username: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      phone: this.phone,
    };
  }
}
