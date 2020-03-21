import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { mockEntity, mockFilteredQuery } from '../../../../../test/helpers/utils.jest';
import { QueryService } from './query.service';

describe('Query Service', () => {
    let queryService: QueryService;
    let model: Model<any>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QueryService,
            ],
        }).compile();

        model = { find: jest.fn() } as any;
        mockFilteredQuery(model.find as jest.Mock, {}, {}, {});

        queryService = module.get<QueryService>(QueryService);
    });

    it('should return the filtered result', async () => {
        mockFilteredQuery(model.find as jest.Mock, { id: 1 }, { id: 2 }, { id: 3 });

        const result = await queryService.page(model, {});

        expect(result.items.map(x => x.id)).toEqual([1, 2, 3]);
    });

    it('should apply given sort field (ascending)', async () => {
        const sortMock = jest.fn();
        sortMock.mockImplementation(() => ({
            skip: () => ({
                limit: () => ({
                    exec: async () => [mockEntity({})],
                }),
            }),
        }));

        (model.find as jest.Mock).mockImplementation(() => ({
            countDocuments: () => ({ exec: jest.fn() }),
            sort: sortMock,
        }));

        await queryService.page(model, { sort: 'name' });

        expect(sortMock).toBeCalledWith({ name: 1 });
    });

    it('should apply given sort field (descending)', async () => {
        const sortMock = jest.fn();
        sortMock.mockImplementation(() => ({
            skip: () => ({
                limit: () => ({
                    exec: async () => [mockEntity({})],
                }),
            }),
        }));

        (model.find as jest.Mock).mockImplementation(() => ({
            countDocuments: () => ({ exec: jest.fn() }),
            sort: sortMock,
        }));

        await queryService.page(model, { sort: '-name' });

        expect(sortMock).toBeCalledWith({ name: -1 });
    });

    it('should apply `_id` sort field by default', async () => {
        const sortMock = jest.fn();
        sortMock.mockImplementation(() => ({
            skip: () => ({
                limit: () => ({
                    exec: async () => [mockEntity({})],
                }),
            }),
        }));

        (model.find as jest.Mock).mockImplementation(() => ({
            countDocuments: () => ({ exec: jest.fn() }),
            sort: sortMock,
        }));

        await queryService.page(model, {});

        expect(sortMock).toBeCalledWith({ _id: 1 });
    });

    it('should apply correct page start limit', async () => {
        const skipMock = jest.fn();
        skipMock.mockImplementation(() => ({
            limit: () => ({
                exec: async () => [mockEntity({})],
            }),
        }));

        (model.find as jest.Mock).mockImplementation(() => ({
            countDocuments: () => ({ exec: jest.fn() }),
            sort: () => ({
                skip: skipMock,
            }),
        }));

        await queryService.page(model, { page: 3, limit: 10 });

        expect(skipMock).toBeCalledWith(20);
    });

    it('should apply correct page end limit', async () => {
        const limitMock = jest.fn();
        limitMock.mockImplementation(() => ({
            exec: async () => [mockEntity({})],
        }));

        (model.find as jest.Mock).mockImplementation(() => ({
            countDocuments: () => ({ exec: jest.fn() }),
            sort: () => ({
                skip: () => ({
                    limit: limitMock,
                }),
            }),
        }));

        await queryService.page(model, { page: 5, limit: 12 });

        expect(limitMock).toBeCalledWith(12);
    });

    it('should apply no filter condition when search and given condition are empty', async () => {
        await queryService.page(model, {});
        expect((model.find as jest.Mock).mock.calls[0][0]).toBeUndefined();
    });

    it('should apply given condition when search is empty', async () => {
        await queryService.page(model, { condition: { name: 'Alice' } });
        expect(model.find as jest.Mock).toBeCalledWith({ name: 'Alice' });
    });
});
