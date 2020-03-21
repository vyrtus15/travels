import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { RoleType } from '../../../common/roleType';

@Exclude()
export class UserDto {
  static readonly emailMaxLength = 100;
  static readonly firstNameMaxLength = 100;
  static readonly lastNameMaxLength = 100;

  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  userName: string;

  @ApiProperty()
  @Expose()
  firstName: string;

  @ApiProperty()
  @Expose()
  lastName: string;

  @ApiProperty({ enum: RoleType.all(), isArray: true })
  @Expose()
  roles: RoleType[];

  @ApiProperty()
  @Expose()
  createdOn: Date;
}
