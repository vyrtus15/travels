import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../users/dto/user.dto';

export class AccessTokenDto {
  constructor(accessToken: string, user: UserDto) {
    this.userId = user.id;
    this.accessToken = accessToken;
  }

  @ApiProperty()
  userId: string;

  @ApiProperty({ description: 'JWT token.' })
  accessToken: string;
}