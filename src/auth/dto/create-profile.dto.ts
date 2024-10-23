import { Prop } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class ProfileDto {
  @IsNotEmpty()
  @IsString()
  name: string;


  @IsNotEmpty()
  @Prop()
  address: string;

  @IsNotEmpty()
  @Prop()
  phoneNumber: string;




}

