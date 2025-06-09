import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { UserType } from '../../../types/user-type.enum.js';
import { UserValidationMessages } from './user.messages.js';

export class CreateUserDto {
  @IsEmail({}, { message: UserValidationMessages.email.invalidFormat })
  public email!: string;

  @IsOptional()
  @IsString({ message: UserValidationMessages.avatarPath.invalidFormat })
  public avatarPath?: string;

  @IsString({ message: UserValidationMessages.name.invalidFormat })
  @Length(1, 15, { message: UserValidationMessages.name.lengthField })
  public name!: string;

  @IsString({ message: UserValidationMessages.password.invalidFormat })
  @Length(6, 12, { message: UserValidationMessages.password.lengthField })
  public password!: string;

  @IsEnum(UserType, { message: UserValidationMessages.userType.invalidFormat })
  public userType!: UserType;
}
