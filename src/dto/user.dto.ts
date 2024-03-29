import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsPhoneNumber, Max, Min } from 'class-validator';
import mongoose from 'mongoose';

export let publicUserData = 
  `
  nickname
  phone
  name 
  surename 
  email
  sex 
  age 
  city 
  about
  photo
  friends
  `;

export class Extra {
  @IsOptional()
  name : string;
  @IsOptional()
  surename : string;
  @IsOptional() 
  @IsEmail()
  email : string;
  @IsOptional()
  sex : string;
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(99)
  age : number;
  @IsOptional()
  city : string;
  @IsOptional()
  about : string;
  @IsOptional()
  photo : string;
  @IsOptional()
  friends?: [mongoose.Types.ObjectId];
}

export class UserDto extends Extra {
  @IsNotEmpty()
  nickname: string;
  @IsPhoneNumber()
  phone: string;
  @IsOptional()
  code : string;
  @IsOptional()
  failedLoginAttempt : number;
}


export class CallVerifyDto {
  @IsNotEmpty()
  nickname: string;
}
export class SignupDto {
  @IsNotEmpty()
  nickname: string;
  @IsPhoneNumber()
  phone: string;
  @IsOptional()
  code : string;
}

export class LoginDataDto {
  @IsNotEmpty()
  nickname: string;
  @IsNotEmpty()
  code : string;
}

export class UpdateUserDto extends Extra {
  @IsNotEmpty()
  nickname: string;
  @IsPhoneNumber()
  phone: string;
}
export class AddFriendDto{
  _id: any;
}

