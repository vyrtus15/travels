import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemaNames } from '../../common/schemas';
import { UsersController } from './controllers/users.controller';
import { buildUserSchema, UsersSchema } from './schema/user.schema';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([{
      name: SchemaNames.User,
      useFactory: () => buildUserSchema(),
    }]),
  ],
  controllers: [UsersController],
  providers: [UsersService],

  exports: [
    UsersService,
    MongooseModule.forFeature([{ name: SchemaNames.User, schema: UsersSchema }]),
  ],
})
export class UsersModule { }
