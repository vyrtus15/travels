import { createParamDecorator } from '@nestjs/common';
import { AuthTravelPipe } from './authTravel.pipe';

export const AuthTravelParamDecorator = createParamDecorator(
  ([userIdParam, idParam]: [string, string], req) => [req.params[userIdParam], req.params[idParam]]);

export const AuthTravel = (userIdParam: string, idParam: string) =>
  AuthTravelParamDecorator([userIdParam, idParam], AuthTravelPipe);
