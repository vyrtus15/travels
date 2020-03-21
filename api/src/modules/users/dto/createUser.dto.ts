import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { UserDto } from './user.dto';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(UserDto.emailMaxLength)
  @Transform((value) => value && typeof value.toLowerCase === 'function' ? value.toLowerCase() : value)
  userName: string;

  @IsNotEmpty()
  @MaxLength(UserDto.firstNameMaxLength)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(UserDto.lastNameMaxLength)
  lastName: string;
}
