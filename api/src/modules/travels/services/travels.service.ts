import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToClass } from 'class-transformer';
import { Document, Model } from 'mongoose';
import { SchemaNames } from '../../../common/schemas';
import { PageResult } from '../../../interfaces/pageResult.interface';
import { PageSearch } from '../../../interfaces/pageSearch.interface';
import { QueryService } from '../../infrastructure/database/services/query.service';
import { AddTravelDto } from '../dto/addTravel.dto';
import { TravelDto } from '../dto/travel.dto';
import { UpdateTravelDto } from '../dto/updateTravel.dto';
import { Travel } from '../schema/travel.interface';
import { PageDto } from '../../../dto/page.dto';

@Injectable()
export class TravelsService {
  public static readonly DEFAULT_SORT_FIELD = '-startDate';

  constructor(
    private readonly queryService: QueryService,
    @InjectModel(SchemaNames.Travels) private readonly travelsModel: Model<Travel>,
  ) { }

  async find(pagination: PageDto, userId: string): Promise<PageResult<TravelDto>> {
    const filter: PageSearch = {
      ...pagination,
      sort: TravelsService.DEFAULT_SORT_FIELD,
      condition: { userId },
    };

    const page = await this.queryService.page(this.travelsModel, filter);

    return {
      ...page,
      items: page.items.map(x => this.serialize(x)),
    }
  }

  async findOne(id: string): Promise<TravelDto> {
    return this.serialize(await this.findEntity(id));
  }

  async add(userId: string, travel: AddTravelDto): Promise<TravelDto> {
    travel.startDate = travel.startDate ?? new Date();
    travel.endDate = travel.endDate ?? new Date();

    const entity = new this.travelsModel({ userId, ...travel });
    await entity.save();

    return this.serialize(entity);
  }

  async update(id: string, travel: UpdateTravelDto): Promise<TravelDto> {
    const entity = await this.findEntity(id);

    Object.keys(travel).forEach((key) => {
      entity[key] = travel[key];
    });

    await entity.save();

    return this.serialize(entity);
  }

  async delete(id: string): Promise<void> {
    const entity = await this.findEntity(id);

    await entity.remove();
  }

  private serialize(travel: Document) {
    return plainToClass(TravelDto, travel.toJSON());
  }

  private async findEntity(id: string) {
    const travel = await this.travelsModel.findOne({ id }).exec();

    if (!travel) {
      throw new HttpException('Not found.', HttpStatus.NOT_FOUND);
    }

    return travel;
  }
}
