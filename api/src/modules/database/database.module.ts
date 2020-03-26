import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigKeys } from '../../common/constants';
import { AuthModule } from '../auth/authModule';
import { UsersModule } from '../users/users.module';
import { QueryService } from './services/query.service';
import { SeedService } from './services/seed.service';

@Global()
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>(ConfigKeys.mongoUri),
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
      }),
    }),
    AuthModule,
    UsersModule,
  ],
  providers: [
    SeedService,
    QueryService,
  ],
  exports: [QueryService],
})
export class DatabaseModule { }
