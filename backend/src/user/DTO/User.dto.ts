import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  Matches,
} from 'class-validator';

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
}
