import { IsEmail, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, Length } from "class-validator";

export class LoginDto {

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;


}




