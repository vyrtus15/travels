import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/authModule';
import { TravelsModule } from '../travels/travels.module';
import { CoreModule } from '../core/core.module';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    CoreModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    TravelsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
