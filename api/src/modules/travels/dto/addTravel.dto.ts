import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class AddTravelDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  destination: string;

  @ApiPropertyOptional({ description: 'Travel start date.' })
  @IsOptional()
  @IsDateString({ message: 'startDate should be an ISO 8601 date representation.' })
  startDate: Date;

  @ApiPropertyOptional({ description: 'Travel end date.' })
  @IsOptional()
  @IsDateString({ message: 'endDate should be an ISO 8601 date representation.' })
  endDate: Date;

  @ApiPropertyOptional({ description: 'Comment regarding travel.' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  comment?: string;
}
