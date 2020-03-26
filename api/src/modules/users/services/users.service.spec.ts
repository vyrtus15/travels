import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mockEntity, mockQuery } from '../../../../test/helpers/utils.jest';
import { RoleType } from '../../../common/roleType';
import { SchemaNames } from '../../../common/schemas';
import { QueryService } from '../../database/services/query.service';
import { UserDto } from '../dto/user.dto';
import { UsersService } from './users.service';
import { PageDto } from '../../../dto/page.dto';

describe('Users Service', () => {
  let service: UsersService;
  let modelMock: {
    findOne: jest.Mock,
    find: jest.Mock,
  };
  let queryService: QueryService;

  beforeEach(async () => {
    modelMock = jest.fn(v => mockEntity(v)) as any;
    modelMock.findOne = jest.fn();
    modelMock.find = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService, {
          provide: getModelToken(SchemaNames.User),
          useValue: modelMock,
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
        },
      ],
    }).compile();

    queryService = module.get<QueryService>(QueryService);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne()', () => {
    it('should throw with NotFound status when user not found', async () => {
      mockQuery(modelMock.findOne, null);
      await expect(service.findOne('abc')).rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
    });

    it('should query the user by `id` field', async () => {
      mockQuery(modelMock.findOne, {});

      const id = 'abc';
      await service.findOne(id);

      expect(modelMock.findOne).toBeCalledWith({ id });
    });

    it('should return the found user', async () => {
      const user: Partial<UserDto> = {
        id: 'abc',
        firstName: 'test',
        lastName: 'test',
        userName: 'test@travels.com',
        roles: [RoleType.user],
      };

      mockQuery(modelMock.findOne, user);

      expect(await service.findOne('abc')).toMatchObject(user);
    });
  });

  describe('find()', () => {
    it('should return an array of class instances', async () => {
      const result = await service.find({} as any);
      expect(result.items[0]).toBeInstanceOf(UserDto);
    });

    it('should not apply any default filtering', async () => {
      await service.find({} as any);

      expect((queryService.page as jest.Mock).mock.calls[0][1].condition).toEqual({});
    });

    it('should apply role filtering when provided', async () => {
      await service.find({} as PageDto, RoleType.user);
      expect((queryService.page as jest.Mock).mock.calls[0][1].condition.roles).toMatchObject([RoleType.user]);
    });
  });

  describe('update', () => {
    it('should throw with NotFound status when user not found', async () => {
      mockQuery(modelMock.findOne, null);
      await expect(service.update('abc', { firstName: 'test', lastName: 'test' }))
        .rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
    });

    it('should update by matching `id`', async () => {
      mockQuery(modelMock.findOne, {});
      await service.update('abc', {} as any);

      expect(modelMock.findOne).toBeCalledWith({ id: 'abc' });
    });

    it('should save the entity', async () => {
      const entity = mockQuery(modelMock.findOne, {});
      await service.update('abc', {} as any);

      expect(entity.save).toBeCalledTimes(1);
    });

    it('should return the updated entity', async () => {
      const initial = { firstName: 'john', lastName: 'doe' };
      const updated = { firstName: 'joe', lastName: 'dhoe' };

      mockQuery(modelMock.findOne, initial);

      expect(await service.update('abc', updated)).toMatchObject(updated);
    });
  });

  describe('delete', () => {
    it('should throw with NotFound status when user not found', async () => {
      mockQuery(modelMock.findOne, null);
      await expect(service.delete('abc')).rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
    });

    it('should remove the entity', async () => {
      const entity = mockQuery(modelMock.findOne, {});
      await service.delete('abc');

      expect(entity.remove).toBeCalledTimes(1);
    });

    it('should remove the entity by given `id`', async () => {
      mockQuery(modelMock.findOne, {});
      await service.delete('abc');

      expect(modelMock.findOne).toBeCalledWith({ id: 'abc' });
    });
  });
});
