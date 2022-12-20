import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  nickname: string;
  @IsPhoneNumber()
  phone: string;
}

export class LoginDataDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
}
export class Base {
  @IsOptional()
  phone : string;
  @IsOptional()
  about: string;
}

export class CreateUserDto{
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  username: string;
  @IsOptional()
  phone : string;
  @IsOptional()
  about: string;
}

export class UpdateUserDto {
  @IsOptional()
  email: string;
  @IsOptional()
  password: string;
  @IsOptional()
  username: string;
  @IsOptional()
  phone : string;
  @IsOptional()
  about: string;
}