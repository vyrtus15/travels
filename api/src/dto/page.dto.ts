import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PageDto {
  @ApiPropertyOptional({ description: 'Index of the page to get (starts from 1).', default: 1 })
  @Transform(parseInt)
  @IsNumber({ allowNaN: false })
  @IsOptional()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ description: 'Number of results per page.', default: 10, minimum: 1, maximum: 100 })
  @Transform(parseInt)
  @IsNumber({ allowNaN: false })
  @IsOptional()
  @Min(1)
  @Max(100)
  limit: number = 10;
}