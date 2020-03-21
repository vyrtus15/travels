import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TravelDto {
  @ApiProperty()
  @Expose()
  id: string;

  @Expose({ toClassOnly: true })
  userId: string;

  @ApiProperty()
  @Expose()
  startDate: Date;

  @ApiProperty()
  @Expose()
  endDate: Date;

  @ApiProperty({ description: 'Destination of the travel.' })
  @Expose()
  destination: string;

  @ApiProperty({ description: 'Comment related to travel.' })
  @Expose()
  comment: string;
}
