import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { PassportLocalModel } from 'mongoose';
import { Strategy } from 'passport-local';
import { SchemaNames } from '../../../common/schemas';
import { User } from '../../users/schema/user.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(SchemaNames.User) readonly userModel: PassportLocalModel<User>,
  ) {
    super({
      usernameField: 'userName',
      passportField: 'password',
    }, userModel.authenticate());
  }
}
