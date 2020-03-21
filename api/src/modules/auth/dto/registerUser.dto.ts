import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { UserDto } from '../../users/dto/user.dto';

export class RegisterUserDto {
  @ApiProperty({ description: 'email' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(UserDto.emailMaxLength)
  userName: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(UserDto.firstNameMaxLength)
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @MaxLength(UserDto.lastNameMaxLength)
  lastName: string;

  @ApiProperty({ minLength: 6, maxLength: 20 })
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(20)
  password: string;
}
