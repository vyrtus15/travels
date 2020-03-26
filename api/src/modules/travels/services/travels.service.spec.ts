import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mockEntity, mockFilteredQuery, mockQuery } from '../../../../test/helpers/utils.jest';
import { SchemaNames } from '../../../common/schemas';
import { QueryService } from '../../database/services/query.service';
import { SearchTravelDto } from '../dto/searchTravel.dto';
import { TravelDto } from '../dto/travel.dto';
import { TravelsService } from './travels.service';

describe('Travels Service', () => {
  let service: TravelsService;
  let queryService: QueryService;
  let model: {
    find: jest.Mock,
    findOne: jest.Mock,
  };

  beforeEach(async () => {
    model = jest.fn().mockImplementation(() => mockEntity({})) as any;
    model.find = jest.fn();
    model.findOne = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TravelsService,
        {
          provide: getModelToken(SchemaNames.Travels),
          useValue: model,
        }, {
          provide: QueryService,
          useValue: {
            page: jest.fn().mockImplementation(async () => ({
              page: 1,
              limit: 10,
              total: 1,
              items: [mockEntity({})],
            })),
          },
        }],
    }).compile();

    queryService = module.get<QueryService>(QueryService);
    service = module.get<TravelsService>(TravelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find', () => {
    it('should return an array of class instances', async () => {
      expect((await service.find({} as SearchTravelDto, '123')).items[0]).toBeInstanceOf(TravelDto);
    });

    it('should apply `userId` filtering', async () => {
      mockFilteredQuery(model.find, {}, {}, {});
      await service.find({} as SearchTravelDto, '123');

      expect((queryService.page as jest.Mock).mock.calls[0][1].condition).toEqual({ userId: '123' });
    });

    it('should apply `destination` filtering', async () => {
      mockFilteredQuery(model.find, {}, {}, {});
      await service.find({ destination: '42' } as SearchTravelDto, '123');

      expect((queryService.page as jest.Mock).mock.calls[0][1].condition).toEqual({ userId: '123', $text: { $search: '42' } });
    });

    it('should apply `startDate` filtering', async () => {
      mockFilteredQuery(model.find, {}, {}, {});
      await service.find({ startDate: new Date('2020-04-25') } as SearchTravelDto, '123');

      expect((queryService.page as jest.Mock).mock.calls[0][1].condition).toEqual({ userId: '123', endDate: { $gte: new Date('2020-04-25') } });
    });

    it('should apply `endDate` filtering', async () => {
      mockFilteredQuery(model.find, {}, {}, {});
      await service.find({ endDate: new Date('2020-04-24') } as SearchTravelDto, '123');

      expect((queryService.page as jest.Mock).mock.calls[0][1].condition).toEqual({ userId: '123', startDate: { $lte: new Date('2020-04-24') }, });
    });

    it('should apply the default sorting', async () => {
      mockFilteredQuery(model.find, {}, {}, {});
      await service.find({} as SearchTravelDto, '123');

      expect((queryService.page as jest.Mock).mock.calls[0][1].sort).toEqual(TravelsService.DEFAULT_SORT_FIELD);
    });
  });

  describe('add', () => {
    it('should save a new entity', async () => {
      const entityMock = mockEntity({});
      (model as any).mockImplementation(() => entityMock);

      await service.add('abc', { dateTime: new Date(2020, 1, 1) } as any);

      expect(entityMock.save).toBeCalled();
    });

    it('should return a class instance', async () => {
      const result = await service.add('abc', {} as any);
      expect(result).toBeInstanceOf(TravelDto);
    });
  });

  describe('update', () => {
    it('should throw HttpException when travel not found', async () => {
      mockQuery(model.findOne, null);
      await expect(service.update('42', {} as any)).rejects.toBeInstanceOf(HttpException);
    });

    it('should throw with NotFound status when travel not found', async () => {
      mockQuery(model.findOne, null);
      await expect(service.update('42', {} as any)).rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
    });

    it('should update by matching `travelId`', async () => {
      mockQuery(model.findOne, {});
      await service.update('42', {} as any);

      expect(model.findOne).toBeCalledWith({ id: '42' });
    });

    it('should save the entity', async () => {
      const entity = mockQuery(model.findOne, {});
      await service.update('42', {} as any);

      expect(entity.save).toBeCalledTimes(1);
    });

    it('should return the updated entity', async () => {
      const initial = { destination: 'test-4' };
      const updated: any = { destination: 'test-42' };
      mockQuery(model.findOne, initial);

      expect(await service.update('42', updated)).toMatchObject(updated);
    });

    it('should return a class instance', async () => {
      mockQuery(model.findOne, {});
      expect(await service.update('42', {} as any)).toBeInstanceOf(TravelDto);
    });
  });

  describe('delete', () => {
    it('should throw HttpException when travel not found', async () => {
      mockQuery(model.findOne, null);
      await expect(service.delete('42')).rejects.toBeInstanceOf(HttpException);
    });

    it('should throw with NotFound status when travel not found', async () => {
      mockQuery(model.findOne, null);
      await expect(service.delete('42')).rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
    });

    it('should remove the entity', async () => {
      const entity = mockQuery(model.findOne, {});
      await service.delete('42');

      expect(entity.remove).toBeCalledTimes(1);
    });

    it('should remove the entity by given `id`', async () => {
      mockQuery(model.findOne, {});
      await service.delete('42');

      expect(model.findOne).toBeCalledWith({ id: '42' });
    });
  });
});
