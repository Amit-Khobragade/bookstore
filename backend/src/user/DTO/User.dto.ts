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

// ENUM

export enum UserRoles {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SELLER = 'SELLER',
}

// DTOs

export class UserJwtPayload {
  id: string;
  isAuthorized: boolean;
  role: UserRoles;
  address: string;
  phone: string;
  name: string;
  email: string;
  iat: number;
  exp: number;
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

export class UserSignInRequest {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/[a-zA-Z0-9@!#%$&]{8,}/, {
    message: 'Create a password larger than 8 characters',
  })
  password: string;
}

export class UserUpdateRequest {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;

  @IsOptional()
  @IsEnum(UserRoles)
  role: UserRoles;
}
