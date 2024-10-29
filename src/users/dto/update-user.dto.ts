import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(OmitType(CreateUserDto, ['password'] as const)) {}


export class ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}