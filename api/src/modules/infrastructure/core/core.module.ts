import { Global, HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthModule } from '../health/health.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    HealthModule,
    HttpModule,
  ],
  exports: [
    ConfigModule,
    HttpModule,
  ],
})
export class CoreModule { }
