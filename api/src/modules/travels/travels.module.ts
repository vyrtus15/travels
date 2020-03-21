import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchemaNames } from '../../common/schemas';
import { UsersModule } from '../users/users.module';
import { TravelsController } from './controllers/travels.controller';
import { TravelSchema } from './schema/travel.schema';
import { TravelsService } from './services/travels.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([{
      name: SchemaNames.Travels,
      schema: TravelSchema,
    }]),
  ],
  controllers: [TravelsController],
  providers: [
    TravelsService,
  ],
})
export class TravelsModule { }
