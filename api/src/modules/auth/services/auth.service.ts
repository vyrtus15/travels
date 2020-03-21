import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { PassportLocalModel } from 'mongoose';
import { RoleType } from '../../../common/roleType';
import { SchemaNames } from '../../../common/schemas';
import { UserDto } from '../../users/dto/user.dto';
import { User } from '../../users/schema/user.interface';
import { UsersService } from '../../users/services/users.service';
import { AccessTokenDto } from '../dto/accessToken.dto';
import { RegisterUserDto } from '../dto/registerUser.dto';
import { JwtPayload } from '../strategies/jwtPayload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    @InjectModel(SchemaNames.User) private readonly userModel: PassportLocalModel<User>,
  ) { }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    try {
      return await this.userService.findOne(payload.sub);
    } catch (e) {
      if (e.status === HttpStatus.NOT_FOUND) {
        return null;
      }

      throw e;
    }
  }

  async createToken(user: UserDto) {
    if (!user) {
      throw new Error('User cannot be empty.');
    }

    const payload: JwtPayload = {
      sub: user.id,
      username: user.userName,
      roles: [...user.roles],
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return new AccessTokenDto(accessToken, user);
  }

  async register(user: RegisterUserDto, ...roles: RoleType[]) {
    const { password, ...data } = user;

    const userExists = await this.userModel.findOne({ userName: data.userName });
    if (userExists) {
      throw new ConflictException('User with such userName exists');
    }

    const entity = new this.userModel({ ...data, roles });
    await this.userModel.register(entity, password);
  }

}
