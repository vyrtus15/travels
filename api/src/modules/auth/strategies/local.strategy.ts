import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { AuthenticateMethod, PassportLocalModel } from 'mongoose';
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
    }, LocalStrategy.decorateAuthenticateMethod(userModel.authenticate()));
  }

  private static decorateAuthenticateMethod(authenticateMethod: AuthenticateMethod<User>) {
    return (userName: string, password: string, callback: (err: any, user: User | boolean, error: any) => void) => {
      authenticateMethod(userName, password, (err, user: any, error) => {
        return callback(err, user, error);
      });
    };
  }
}
