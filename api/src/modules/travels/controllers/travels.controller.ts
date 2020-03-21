import { Body, Controller, Delete, Get, HttpCode, Post, Put, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleType } from '../../../common/roleType';
import { PageResult } from '../../../interfaces/pageResult.interface';
import { ApiPageOkResponse, ApiTravelParam, ApiTravelsForbiddenResponse, ApiUserParam } from '../../../swagger/api.decorator';
import { Authorize, Roles } from '../../auth/decorators/auth.decorator';
import { AuthOwnUser } from '../../users/authorization/auth.decorator';
import { UserDto } from '../../users/dto/user.dto';
import { AuthTravel } from '../authorization/authTravel.decorator';
import { AddTravelDto } from '../dto/addTravel.dto';
import { TravelDto } from '../dto/travel.dto';
import { UpdateTravelDto } from '../dto/updateTravel.dto';
import { TravelsService } from '../services/travels.service';
import { PageDto } from '../../../dto/page.dto';

@ApiTags('travels')
@ApiBearerAuth()
@Controller('user/:user/travels')
@Authorize()
@Roles(RoleType.user, RoleType.admin)
export class TravelsController {
  constructor(private readonly travelsService: TravelsService) { }

  @ApiOperation({ description: 'Gets a list of travels for a user.' })
  @ApiUserParam('user')
  @ApiPageOkResponse(TravelDto)
  @ApiTravelsForbiddenResponse()
  @Get()
  async search(@Query() filter: PageDto, @AuthOwnUser('user') user: UserDto): Promise<PageResult<TravelDto>> {
    return await this.travelsService.find(filter, user.id);
  }

  @ApiOperation({ description: 'Add a travel record to a user.' })
  @ApiUserParam('user')
  @ApiCreatedResponse({ type: TravelDto })
  @ApiTravelsForbiddenResponse()
  @Post()
  async create(@AuthOwnUser('user') user: UserDto, @Body() travel: AddTravelDto): Promise<TravelDto> {
    const result = await this.travelsService.add(user.id, travel);

    return result;
  }

  @ApiOperation({ description: 'Updates a travel record of a user.' })
  @ApiUserParam('user')
  @ApiTravelParam('id')
  @ApiOkResponse({ type: TravelDto })
  @ApiTravelsForbiddenResponse()
  @Put(':id')
  async update(@AuthTravel('user', 'id') travel: TravelDto, @Body() data: UpdateTravelDto): Promise<TravelDto> {
    const result = await this.travelsService.update(travel.id, data);

    return result;
  }

  @ApiOperation({ description: 'Delete a travel record of a user.' })
  @ApiUserParam('user')
  @ApiTravelParam('id')
  @ApiNoContentResponse({ description: 'Travel record successfully deleted.' })
  @ApiTravelsForbiddenResponse()
  @Delete(':id')
  @HttpCode(204)
  async delete(@AuthTravel('user', 'id') travel: TravelDto) {
    await this.travelsService.delete(travel.id);
  }
}
