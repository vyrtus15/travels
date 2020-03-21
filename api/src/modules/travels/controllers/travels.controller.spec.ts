import { Test, TestingModule } from '@nestjs/testing';
import { TravelsService } from '../services/travels.service';
import { TravelsController } from './travels.controller';
import { PageDto } from '../../../dto/page.dto';

describe('Travels Controller', () => {
  let controller: TravelsController;
  let travelsService: TravelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{
        provide: TravelsService,
        useValue: {
          find: jest.fn(),
          add: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        },
      }],
    }).compile();

    travelsService = module.get<TravelsService>(TravelsService);
    controller = new TravelsController(travelsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should search travels', async () => {
    const user: any = { id: 'test' };

    await controller.search({} as PageDto, user);

    expect(travelsService.find).toBeCalledWith({}, user.id);
  });

  it('should create a travel record', async () => {
    const user: any = { id: 'test' };
    const travel: any = { destination: 'test' };

    jest.spyOn(travelsService, 'add').mockImplementation(async () => ({} as any));
    await controller.create(user, travel);

    expect(travelsService.add).toBeCalledWith(user.id, travel);
  });

  it('should update a travel record', async () => {
    const travel: any = { destination: 'test' };

    jest.spyOn(travelsService, 'update').mockImplementation(async () => ({} as any));
    await controller.update({ id: '42' } as any, travel);

    expect(travelsService.update).toBeCalledWith('42', travel);
  });

  it('should delete a travel record', async () => {
    await controller.delete({ id: '42' } as any);
    expect(travelsService.delete).toBeCalledWith('42');
  });
});
