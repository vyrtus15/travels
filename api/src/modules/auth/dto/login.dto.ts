import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: `userName` })
  userName: string;

  @ApiProperty()
  password: string;
}
