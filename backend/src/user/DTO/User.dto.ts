import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  Matches,
  IsOptional,
  IsEnum,
} from 'class-validator';

export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SELLER = 'SELLER',
}

export class UserSignUpRequest {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/[a-zA-Z0-9@!#%$&]{8,}/, {
    message: 'Create a password larger than 8 characters',
  })
  password: string;

  @IsOptional()
  @IsEnum(UserRoles)
  role: UserRoles = UserRoles.USER;
}

export class UserInfoResponseDTO {
  name: string;
  role: UserRoles;
  isAuthorized: boolean;
  key: string;

  constructor({ name, role, isAuthorized, key }: Partial<UserInfoResponseDTO>) {
    this.name = name;
    this.role = role;
    this.isAuthorized = isAuthorized;
    this.key = key;
  }
}
