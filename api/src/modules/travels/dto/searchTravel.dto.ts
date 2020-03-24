import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { PageDto } from '../../../dto/page.dto';
import { PageSearch } from '../../../interfaces/pageSearch.interface';

export class SearchTravelDto extends PageDto implements PageSearch {
  @ApiPropertyOptional({ description: 'Destination of travel.' })
  @IsString()
  @IsOptional()
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
}
