import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: `User's userName.` })
  userName: string;

  @ApiProperty()
  password: string;
}
