import { ApiProperty } from '@nestjs/swagger';

export class AccessTokenDto {
  constructor(accessToken: string, userId: string) {
    this.userId = userId;
    this.accessToken = accessToken;
  }

  @ApiProperty()
  userId: string;

  @ApiProperty({ description: 'JWT token.' })
  accessToken: string;
}