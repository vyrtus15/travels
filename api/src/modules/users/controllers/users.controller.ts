import { Body, Controller, Delete, Get, HttpCode, Put, Query, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RoleType } from '../../../common/roleType';
import { PageDto } from '../../../dto/page.dto';
import { PageResult } from '../../../interfaces/pageResult.interface';
import { ApiOperationFor, ApiPageOkResponse, ApiUserForbiddenResponse, ApiUserParam } from '../../../swagger/api.decorator';
import { Authorize, Roles } from '../../auth/decorators/auth.decorator';
import { AuthUser } from '../authorization/auth.decorator';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { UserDto } from '../dto/user.dto';
import { UsersService } from '../services/users.service';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
@Authorize()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) { }

  @ApiOperation({ description: 'Gets the details of the currently logged in user.' })
  @ApiOkResponse({ type: UserDto })
  @Get('me')
  public async getCurrent(@Request() req): Promise<UserDto> {
    if (!req.user) {
      throw new Error('Request user not set. Ensure @Authorize() guard is configured in the pipeline.');
    }

    return await this.usersService.findOne(req.user.id);
  }

  @ApiOperationFor('Gets a list of users.', RoleType.manager, RoleType.admin)
  @ApiPageOkResponse(UserDto)
  @ApiForbiddenResponse({ description: 'Current user not a `moderator` or `admin`.' })
  @Get()
  @Roles(RoleType.manager, RoleType.admin)
  public async getUsers(@Query() filter: PageDto, @Request() request): Promise<PageResult<UserDto>> {
    if (request.user.roles.indexOf(RoleType.admin) !== -1) {
      return await this.usersService.find(filter);
    }

    return await this.usersService.find(filter, RoleType.user);
  }

  @ApiOperation({ description: 'Updates user profile details.' })
  @ApiUserParam('id')
  @ApiOkResponse({ type: UserDto })
  @ApiUserForbiddenResponse()
  @Put(':id')
  public async updateUser(@AuthUser('id') user: UserDto, @Body() data: UpdateUserDto): Promise<UserDto> {
    return await this.usersService.update(user.id, data);
  }

  @ApiOperation({ description: 'Deletes a user and all associated data.' })
  @ApiUserParam('id')
  @ApiNoContentResponse({ description: 'User has been deleted.' })
  @ApiUserForbiddenResponse()
  @Delete(':id')
  @HttpCode(204)
  public async deleteUser(@AuthUser('id') user: UserDto): Promise<void> {
    await this.usersService.delete(user.id);
  }
}
