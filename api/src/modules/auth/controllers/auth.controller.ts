import { Body, Controller, HttpCode, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { RoleType } from '../../../common/roleType';
import { AccessTokenDto } from '../dto/accessToken.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterUserDto } from '../dto/registerUser.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @ApiOperation({ description: 'Issues an access token for provided credentials.' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: AccessTokenDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials.' })
  @Post('login')
  @HttpCode(200)
  @UseGuards(AuthGuard('local'))
  async login(@Request() req): Promise<AccessTokenDto> {
    return await this.authService.createToken(req.user);
  }

  @ApiOperation({ description: 'Registers a new user.' })
  @ApiCreatedResponse({ description: 'User has been successfully registered.' })
  @ApiBadRequestResponse({ description: 'Validation errors or userName already in use.' })
  @Post('register')
  @HttpCode(201)
  async register(@Body() user: RegisterUserDto): Promise<any> {
    return await this.authService.register(user, ...[RoleType.user]);
  }

}
