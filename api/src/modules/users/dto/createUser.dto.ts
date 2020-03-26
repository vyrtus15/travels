import { IsNotEmpty, MaxLength } from 'class-validator';
import { UserDto } from './user.dto';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(UserDto.userNameMaxLength)
  userName: string;

  @IsNotEmpty()
  @MaxLength(UserDto.firstNameMaxLength)
  firstName: string;

  @IsNotEmpty()
  @MaxLength(UserDto.lastNameMaxLength)
  lastName: string;
}
