import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MemoryHealthIndicator, MicroserviceHealthIndicator, MongooseHealthIndicator, TerminusModule } from '@nestjs/terminus';
import { TerminusOptionsService } from './terminusOptions.service';

@Module({
  imports: [
    MongooseModule,
    TerminusModule.forRootAsync({
      inject: [
        ConfigService,
        MongooseHealthIndicator,
        MicroserviceHealthIndicator,
        MemoryHealthIndicator],
      useClass: TerminusOptionsService,
    }),
  ],
})
export class HealthModule { }
